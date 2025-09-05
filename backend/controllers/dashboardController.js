const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        // ensure it's a proper ObjectId
        const userObjectId = new Types.ObjectId(String(userId));

        // fetch total income
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        console.log("totalIncome aggregate result", {
            totalIncome,
            isValidId: isValidObjectId(userId)
        });

        // fetch total expense (fixed typo userObjectId)
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // last 60 days income transactions
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        const last60DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: sixtyDaysAgo },
        }).sort({ date: -1 });

        const incomeLast60DaysTotal = last60DaysIncomeTransactions
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        // last 30 days expense transactions
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: thirtyDaysAgo }
        }).sort({ date: -1 });

        const expensesLast30DaysTotal = last30DaysExpenseTransactions
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        // fetch last 5 income & expense transactions
        const recentTransactions = [
            ...(await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                txn => ({ ...txn.toObject(), type: "income" })
            ),
            ...(await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                txn => ({ ...txn.toObject(), type: "expense" })
            ),
        ].sort((a, b) => b.date - a.date); // latest first

        // final response
        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: expensesLast30DaysTotal,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60DaysTotal,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions
        });

    } catch (error) {
        console.error("getDashboardData error:", error);
        res.status(500).json({ message: "server error", error: error.message });
    }
};
