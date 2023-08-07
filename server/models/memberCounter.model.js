const mongoose = require("mongoose");

const counterMemberSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});

const MemberCounter = mongoose.model("memberCounter", counterMemberSchema);

module.exports = MemberCounter;
