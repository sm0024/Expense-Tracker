
const xlsx = require("xlsx");
const Expense=require("../models/Expense")


//addd expense
exports.addExpense = async (req, res) => {
    const userId = req.user._id;
    try{
        const { icon, category, amount, date } = req.body;

        //validation check for missing fields
        if(!category || !amount || !date){
            return res.status(400).json({ message: "all the fields required" });
    }
    const newExpense = new Expense({
        userId,
        icon,
        category,
        amount,
        date:new Date(date)// ensure date is a Date object
    });
    await newExpense.save();
    res.status(200).json(newExpense)
    }
    catch(error) {
        res.status(500).json({ message:"server error" });
    }

}
//get all expense
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

//delete expense
exports.deleteExpense = async (req, res) => {

    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    }
    catch(error) {
        res.status(500).json({ message: "server error" });
    }  
}

// download expense
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        //prepare data for excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date, // format date as YYYY-MM-DD
        }));

        const wb = xlsx.utils.book_new();   
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "Expense_details.xlsx");
        res.download('Expense_details.xlsx');
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

