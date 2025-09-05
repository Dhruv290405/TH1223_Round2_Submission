// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  aadhaarNumber: {
    type: String,
    required:true,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    required: true,
  },
  
  // email: {
  //   type: String,
  //   lowercase: true,
  // },

  address: {
    state: String,
    district: String,
    city: String,
    pincode: String,
  },

  timeSlot: {
    checkIn: {
      type: Date,
      required: true, // assigned when registering
    },
    checkOut: {
      type: Date,
      required: true,
      deadline:()=>{
        const now = this.checkIn;
        const endDate = new Date(now + 3*24*60*60*1000);  // ise directly endDate set ho jayega
        return endDate;
      } // exit deadline (2–3 days slot etc.)
    },
    extended: {
      type: Boolean,
      default: false, // true if user paid penalty & extended stay
    },
  },

  // Digital Pass Reference
  pass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pass",
    default: null,
  },
  MembersAadhar:{
        type:[String]
  },

  // Accommodation Booking
  // accommodation: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Accommodation",
  //   default: null,
  // },

  // Alert Preferences
  // preferredLanguage: {
  //   type: String,
  //   enum: ["hi", "en", "mr", "gu", "bn", "ta", "te"],
  //   default: "hi",
  // },

  // receiveSMS: {
  //   type: Boolean,
  //   default: true,
  // },

  // receiveIVR: {
  //   type: Boolean,
  //   default: true,
  // },

  // Real-Time Tracking
  // currentZone: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Zone",
  //   default: null,
  // },

  status: {
    type: String,
    enum: ["active", "exited"],
    default: "active",
  },

}, { timestamps: true });

module.exports =  mongoose.model("User", userSchema);