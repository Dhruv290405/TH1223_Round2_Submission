// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },

  age: {
    type: Number,
    min: 0,
  },

  aadhaarNumber: {
    type: String,
    unique: true,
    sparse: true,
  },

  phone: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    lowercase: true,
  },

  address: {
    state: String,
    district: String,
    city: String,
    pincode: String,
  },

  // 🔑 Time Slot Info
  timeSlot: {
    checkIn: {
      type: Date,
      required: true, // assigned when registering
    },
    checkOut: {
      type: Date,
      required: true, // exit deadline (2–3 hr slot etc.)
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

  // Accommodation Booking
  accommodation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accommodation",
    default: null,
  },

  // Alert Preferences
  preferredLanguage: {
    type: String,
    enum: ["hi", "en", "mr", "gu", "bn", "ta", "te"],
    default: "hi",
  },

  receiveSMS: {
    type: Boolean,
    default: true,
  },

  receiveIVR: {
    type: Boolean,
    default: true,
  },

  // Real-Time Tracking
  currentZone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone",
    default: null,
  },

  status: {
    type: String,
    enum: ["active", "exited"],
    default: "active",
  },

}, { timestamps: true });

export default mongoose.model("User", userSchema);

