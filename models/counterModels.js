const mongoose = require("mongoose");

// This schema stores the last used serial number for different models.
const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },  // Example: "userId"
  seq: { type: Number, default: 0 }                    // Last used number
});

module.exports = mongoose.model("Counter", counterSchema);
