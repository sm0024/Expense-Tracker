
const xlsx = require("xlsx");
const Income=require("../models/Income")


//addd income
exports.addIncome = async (req, res) => {
    const userId = req.user._id;
    try{
        const { icon, source, amount, date } = req.body;

        //validation check for missing fields
        if(!source || !amount || !date){
            return res.status(400).json({ message: "all the fields required" });
    }
    const newIncome = new Income({
        userId,
        icon,
        source,
        amount,
        date:new Date(date)// ensure date is a Date object
    });
    await newIncome.save();
    res.status(200).json(newIncome)
    }
    catch(error) {
        res.status(500).json({ message:"server error" });
    }

}
//get all income
exports.getAllIncome = async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

//delete income
exports.deleteIncome = async (req, res) => {

    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted successfully" });
    }
    catch(error) {
        res.status(500).json({ message: "server error" });
    }  
}

// download excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        //prepare data for excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date, // format date as YYYY-MM-DD
        }));

        const wb = xlsx.utils.book_new();   
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "Income_details.xlsx");
        res.download('Income_details.xlsx');
    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

