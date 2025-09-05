const express = require("express");
const {connectdb} = require("./config/mongoose");
const app = express();
app.use(express.json());



connectdb()
.then(()=>{
    console.log("Database is established!!");
    app.listen(4000,()=>{
        console.log("port is listening at 4000");
    })
}).catch((err)=>{
    console.log("something went wrong!");
})