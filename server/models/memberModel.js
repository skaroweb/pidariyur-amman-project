const mongoose = require("mongoose");
const Joi = require("joi");
const MemberCounter = require("./memberCounter.model");

const memberSchema = new mongoose.Schema({
  memberId: { type: String },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  alternatePhoneNumber: { type: String },
  aadhaar: { type: String },
  address: { type: String, required: true },
  district: { type: String, required: true },
  dob: { type: Date },
  email: { type: String },
  joiningDate: { type: Date },
});

memberSchema.pre("save", async function (next) {
  if (!this.memberId) {
    // Generate the memberId only if it doesn't exist
    const counter = await MemberCounter.findOneAndUpdate(
      { _id: "memberId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const memberIdWithLeadingZeros = `${year}${month}${String(
      counter.seq
    ).padStart(4, "0")}`;

    this.memberId = memberIdWithLeadingZeros;
  }

  next();
});

const Member = mongoose.model("member", memberSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    phoneNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required()
      .label("phoneNumber"),
    address: Joi.string().required().label("address"),
    district: Joi.string().required().label("district"),
  }).unknown();
  return schema.validate(data);
};

module.exports = { Member, validate };
