const mongoose = require("mongoose");
const connectDb = async ()=>{
   await mongoose.connect(
        // 'mongodb+srv://admin:test123@akshatnamdev.e3acceq.mongodb.net/?retryWrites=true&w=majority&appName=AkshatNamdev/'
     //paste the connection string
    );
}
module.exports =  {connectDb};
