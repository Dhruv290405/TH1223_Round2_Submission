const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authAdmin = async (req,res,next) =>{
const {UserName,password} = req.body;
const admin = await Admin.findOne({UserName : UserName});
if(!admin){
     throw new Error("Admin not found");
}
else{
    const isPasswordValid = await bcrypt.compare(password,admin.password);
    if(!isPasswordValid){
        return res.status(400).send("Invalid Credentials");
    }
    req.admin = admin;   
    next();
}
}
module.exports = {authAdmin};