const User= require('../models/User');
const jwt =require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn:"12h"});
};

// register user
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;
    //validation checks for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "all fields required" });
    }

    try{
        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Emaial already use" });
        }

        //create new user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });
        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    }
    catch(err){
        res
            .status(500)
            .json({ message: "Error in registration", error: err.message });
    }
};

// logiunuser
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    //validation checks for missing fields
    if (!email || !password) {
        return res.status(400).json({ message: "all fields required" });
    }
    try{
        const user=await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({ message: "Invalid email or password" });
        }
        res.status(200).json({
            id:user._id,
            user,
            token: generateToken(user._id),
        });
    }
    catch(err){
        res.status(500).json({ message: "Error in login", error: err.message });
    }    
    
};

// register user
exports.getUserInfo = async (req, res) => {
    try{
        const user =await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch(err){
         res
            .status(500)
            .json({ message: "Error in registration", error: err.message });
    }
};