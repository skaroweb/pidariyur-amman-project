const mongoose = require("mongoose");

const titleSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const Title = mongoose.model("Title", titleSchema);

module.exports = Title;
