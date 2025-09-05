const mongoose =require("mongoose");

const incomeSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    icon:{type:String, required:true},
    source:{type:String, required:true},//like salary, business, etc
    amount:{type:Number, required:true},
    date:{type:Date, required:true},
}, {timestamps:true});
module.exports=mongoose.model("Income", incomeSchema);