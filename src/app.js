const express = require("express");
const User = require("./models/user")
const Admin = require("./models/admin");
const {authAdmin} = require("./middleware/auth");
const {connectdb} = require("./config/mongoose");
const {isUserValidate, isAdminValidate} = require("./utils/validation");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const QRCode = require('qrcode');
const app = express();
app.use(cookieParser())
app.use(express.json());
// Route to register a pilgrim
app.post("/register",async (req,res)=>{
    try{
    isUserValidate(req);
    const {fullName,aadhaarNumber,phone,address,selectedGhat,timeSlot,MembersAadhar} = req.body;
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
        selectedGhat,
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
// Admin SignUp route
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
// Admin Login route
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
// Generate QR code when pilgrim registers
app.post("/generateQR", async (req, res) => {
    try {
        const { aadhaarNumber, selectedGhat } = req.body;
        
        const user = await User.findOne({ aadhaarNumber });
        if (!user) {
            return res.status(404).send("Pilgrim not found");
        }

        // Create verification token
        const token = jwt.sign({
            userId: user._id,
            aadhaar: user.aadhaarNumber,
            ghat: selectedGhat,
            timeSlot: {
                checkIn: user.timeSlot.checkIn,
                checkOut: user.timeSlot.checkOut
            }
        }, 'Pass@123', { expiresIn: '3d' });

        // Generate QR code containing the token
        const qrCode = await QRCode.toDataURL(token);

        // Update user with tokwen and QR code
        user.selectedGhat = selectedGhat;
        user.pass = {
            token : token,
            qrCode : qrCode
        };
        await user.save();

        res.status(201).json({
            message: "Pass generated successfully",
            qrCode,
            ghat: selectedGhat
        });

    } catch (err) {
        res.status(400).send("Error generating pass: " + err.message);
    }
});
// Verify QR code when scanned at ghat
app.post("/verifyQR", async (req, res) => {
     try {
        const { token, ghatLocation } = req.body;
        
        // Verify token
        const decoded = jwt.verify(token, 'Pass@123');
        
        // Find user
        const user = await User.findById(decoded.userId);
        if (!user || user.pass.token !== token) {
            return res.status(404).send("Invalid pass or pilgrim not found");
        }
        res.send("you can now enetr into the ghat");
        // ...rest of the verification code remains same...
    } catch (err) {
        res.status(400).send("Verification failed: " + err.message);
    }
    // try {
    //     const { token, ghatLocation } = req.body;
        
    //     // Verify token
    //     const decoded = jwt.verify(token, 'your-secret-key');
        
    //     // Find user
    //     const user = await User.findById(decoded.userId);
    //     if (!user) {
    //         return res.status(404).send("Pilgrim not found");
    //     }

    //     // Verify ghat matches
    //     if (decoded.ghat !== ghatLocation) {
    //         return res.status(400).send("Invalid ghat location");
    //     }

    //     // Check if within time slot
    //     const now = new Date();
    //     if (now < user.timeSlot.checkIn || now > user.timeSlot.checkOut) {
    //         return res.status(400).send("Invalid time slot");
    //     }

    //     // Update verification status
    //     user.verificationStatus = {
    //         isVerified: true,
    //         verifiedAt: now,
    //         verifiedAtGhat: ghatLocation
    //     };
    //     await user.save();

    //     res.status(200).json({
    //         message: "Pilgrim verified successfully",
    //         pilgrimName: user.fullName,
    //         timeSlot: user.timeSlot
    //     });

    // } catch (err) {
    //     res.status(400).send("Verification failed: " + err.message);
    // }
});
connectdb()
.then(()=>{
    console.log("Database is established!!");
    app.listen(4000,()=>{
        console.log("port is listening at 4000");
    })
}).catch((err)=>{
    console.log("something went wrong!");
})