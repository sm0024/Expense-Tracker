const mongoose= require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.Mongo_URI, {});
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;