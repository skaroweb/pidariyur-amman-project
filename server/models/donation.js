const mongoose = require("mongoose");
const Joi = require("joi");

const donationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }, // Reference to the User model
    receiptNo: { type: String },
    phoneNumber: { type: String, required: true },
    name: { type: String, required: true },
    donationType: { type: String, required: true },
    amount: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const validate = (data) => {
  const schema = Joi.object({
    phoneNumber: Joi.string().required().label("phoneNumber"),
    donationType: Joi.string().required().label("donationType"),
    amount: Joi.string().required().label("amount"),
  }).unknown();
  return schema.validate(data);
};

const Donation = mongoose.model("donation", donationSchema);

module.exports = { Donation, validate };
