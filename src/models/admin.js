const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  UserName : {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["super_admin", "zone_admin", "volunteer"],
    default: "volunteer",
  },

  assignedZone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Zone", // links volunteer/admin to a specific crowd zone
    default: null,
  },

  // permissions: [
  //   {
  //     type: String,
  //     enum: [
  //       "manage_users",     // add/remove pilgrims
  //       "view_zones",       // check live crowd data
  //       "send_alerts",      // send SMS/IVR messages
  //       "manage_passes",    // approve/extend passes
  //       "view_reports",     // analytics access
  //     ],
  //   },
  // ],

  lastLogin: {
    type: Date,
    default: Date.now,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports =  mongoose.model("Admin", adminSchema);