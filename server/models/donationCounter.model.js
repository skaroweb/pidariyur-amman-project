const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});

const DonationCounter = mongoose.model("donationCounter", counterSchema);

module.exports = DonationCounter;
