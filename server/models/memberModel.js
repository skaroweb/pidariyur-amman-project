const mongoose = require("mongoose");
const Joi = require("joi");

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

const Member = mongoose.model("member", memberSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    phoneNumber: Joi.string().required().label("phoneNumber"),
    address: Joi.string().required().label("address"),
    district: Joi.string().required().label("district"),
  }).unknown();
  return schema.validate(data);
};

module.exports = { Member, validate };
