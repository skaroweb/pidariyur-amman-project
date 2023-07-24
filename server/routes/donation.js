const express = require("express");
const router = express.Router();
const { Donation, validate } = require("../models/donation");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const existingUsers = await Donation.find({});
    const donationCount = existingUsers.length + 1;
    const formattedDonationId = String(donationCount).padStart(4, "0");

    const newDonation = new Donation({
      receiptNo: formattedDonationId,
      ...req.body,
    });
    await newDonation.save();
    // console.log(newMember);
    res.status(201).json(newDonation); // Update 'newUser' to 'newMember' here
  } catch (err) {
    console.error("Error saving new member:", err);
    res.status(500).json({ error: "Failed to create user.", err });
  }
});

// // Handle POST request to store donation data
// router.post("/", (req, res) => {
//   const { userId, phoneNumber, name, donationType, amount } = req.body;

//   const newDonation = new Donation({
//     userId,
//     phoneNumber,
//     name,
//     donationType,
//     amount,
//   });

//   newDonation
//     .save()
//     .then((donation) => {
//       res.json(donation);
//     })
//     .catch((error) => {
//       res.status(500).json({ error: "Failed to save donation data" });
//     });
// });

module.exports = router;
