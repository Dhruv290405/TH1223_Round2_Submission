const mongoose = require("mongoose");
const connectdb = async ()=>{await mongoose.connect(
        'mongodb+srv://admin:test123@akshatnamdev.e3acceq.mongodb.net/Mahakumbh',
)
}
module.exports = {connectdb};