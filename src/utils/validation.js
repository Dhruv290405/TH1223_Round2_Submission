const validator = require("validator");
const isUserValidate = (req) =>{
    const {fullName,aadhaarNumber,phone,address,timeSlot,MembersAadhar} = req.body;
    if(!fullName){
        throw new Error("Full Name is required");
    }
    else if(!aadhaarNumber){
        throw new Error("Aadhaar Number is required");
    }
    else if(!validator.isNumeric(aadhaarNumber) || aadhaarNumber.length!==12){
        throw new Error("Aadhaar Number is not valid");
    }
    else if(!phone){
        throw new Error("Phone Number is required");
    }
    else if(!validator.isMobilePhone(phone) || phone.length!==10){
        throw new Error("Phone Number is not valid");
    }
    else if(!address){
        throw new Error("Address is required");
    }  
    else if(!timeSlot.checkIn){
        throw new Error("check in Time Slot is required");
    }
} 
const isAdminValidate = (req) =>{
    const {name,email,phone,UserName,password,role} = req.body;
    if(!name){
        throw new Error("Name is required");
    }
    else if(!email){
        throw new Error("Email is required");
    }   
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }   
    else if(!phone){
        throw new Error("Phone Number is required");
    }   
    else if(!validator.isMobilePhone(phone) || phone.length!==10){
        throw new Error("Phone Number is not valid");
    }   
    else if(!UserName){
        throw new Error("UserName is required");
    }
    else if(!password){
        throw new Error("Password is required");
    }
    else if(password.length<6 && validator.isStrongPassword(password) ){
        throw new Error("Password is not strong enough");
    }
    else if(role && !["super_admin", "zone_admin", "volunteer"].includes(role)){
        throw new Error("Role is not valid");
    }
}
module.exports = {isUserValidate , isAdminValidate};