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

  aadhaarNumber: { // optional for identity
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

  // Digital Pass Information
  pass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pass", // links to pass collection
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
    enum: ["hi", "en", "mr", "gu", "bn", "ta", "te"], // Hindi, English, etc.
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

  // Real-Time Tracking (optional, from entry gates/IoT)
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
