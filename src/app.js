const express = require("express");
const User = require("./models/user")
const Admin = require("./models/admin");
const {authAdmin} = require("./middleware/auth");
const {connectdb} = require("./config/mongoose");
const {isUserValidate, isAdminValidate} = require("./utils/validation");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
app.use(cookieParser())
app.use(express.json());

app.post("/register",async (req,res)=>{
    try{
    isUserValidate(req);
    const {fullName,aadhaarNumber,phone,address,timeSlot,MembersAadhar} = req.body;
    /*
    ise schema ke hisab se data bhejna hai
    {
        "fullName": "Aditya Kumar", 
        "aadhaarNumber": "123456789012",
        "phone": "9876543210",
        "address": {
            "state": "StateName",
            "district": "DistrictName",
            "city": "CityName",
            "pincode": "123456"
        },
        "timeSlot": {
            "checkIn": "2023-10-01",
            "checkOut": "2023-10-03"
        },
        "MembersAadhar": ["123456789013","123456789014"]
    }
    */ 
    const user = new User({
        fullName,
        aadhaarNumber,
        phone,
        address,
        timeSlot,
        MembersAadhar,
    })
    await user.save();
    res.send("the user is Registered Successfully!!");
}
catch(err){
    res.status(400).send("Error: "+err.message);
}
});
app.post("/signUp",async (req,res)=>{
    try{
     isAdminValidate(req);
    const {name,email,phone,UserName,password,role} = req.body;
    const passwordHash = await bcrypt.hash(password,10);
    const admin = new Admin({
        name,
        email,
        phone,
        UserName,
        password : passwordHash,
        role
    });
    await admin.save();
    res.send("Admin is registered Successfully!!");
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});
app.post("/login",authAdmin,async (req,res)=>{
    try{
        const token = jwt.sign({id:req.admin._id},"Admin@123")
        res.cookie("token",token);
        res.send("Admin is logged in Successfully!!");
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});
app.post("dashboard",async (req,res)=>{
    // const {token} = req.cookies; 
    // const decodeObj = jwt.verify(token,"Admin@123");
})
connectdb()
.then(()=>{
    console.log("Database is established!!");
    app.listen(4000,()=>{
        console.log("port is listening at 4000");
    })
}).catch((err)=>{
    console.log("something went wrong!");
})