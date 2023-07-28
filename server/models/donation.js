const mongoose = require("mongoose");
const Joi = require("joi");
const Counter = require("./counters.model"); // Import the Counter model

const donationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }, // Reference to the User model
    memberId: {
      // Add the memberId field to store the member's object ID
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    donationId: { type: String, unique: true },
    // receiptNo: { type: String },
    phoneNumber: { type: String, required: true },
    name: { type: String, required: true },
    donationType: { type: String, required: true },
    amount: { type: String, required: true },
    selectedDate: {
      type: Date, // The selectedDate field is stored as a Date type in MongoDB
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

donationSchema.pre("save", async function (next) {
  const doc = this;
  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: "donationId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Format the donationId with leading zeros
    const donationIdWithLeadingZeros = String(counter.seq).padStart(4, "0");
    doc.donationId = donationIdWithLeadingZeros;

    next();
  } catch (error) {
    next(error);
  }
});

const validate = (data) => {
  const schema = Joi.object({
    selectedDate: Joi.date().required().label("date"),
    phoneNumber: Joi.string().required().label("phoneNumber"),
    donationType: Joi.string().required().label("donationType"),
    amount: Joi.string().required().label("amount"),
  }).unknown();
  return schema.validate(data);
};

const Donation = mongoose.model("donation", donationSchema);

module.exports = { Donation, validate };
