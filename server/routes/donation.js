const express = require("express");
const router = express.Router();
const { Donation, validate } = require("../models/donation");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    //console.log(req.body);
    // const existingUsers = await Donation.find({});
    // const donationCount = existingUsers.length + 1;
    // const formattedDonationId = String(donationCount).padStart(4, "0");

    const newDonation = new Donation({
      //  receiptNo: formattedDonationId,

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

// Set up the update route
router.put("/:id", async (req, res) => {
  try {
    const donationId = req.params.id;
    const updatedData = req.body;
    // console.log(updatedData);
    // Find the donation by ID and update its data
    const donation = await Donation.findByIdAndUpdate(donationId, updatedData, {
      new: true,
    });

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    return res.status(200).json(donation);
  } catch (error) {
    console.error("Error updating donation:", error);
    return res.status(500).json({ error: "Error updating donation" });
  }
});

// Create a new route to handle delete requests
router.delete("/:id", async (req, res) => {
  const donationId = req.params.id;
  try {
    // Use your database library (e.g., Mongoose) to remove the donation data from the database
    await Donation.findByIdAndDelete(donationId);
    res.status(200).json({ message: "Donation data deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation data:", error);
    res.status(500).json({ message: "Error deleting donation data" });
  }
});

// Handle GET request to retrieve donation data
router.get("/", (req, res) => {
  Donation.find()
    .then((donations) => {
      res.json(donations);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch donation data" });
    });
});

// Route to get specific donation details by ID
router.get("/:id", async (req, res) => {
  try {
    const donationId = req.params.id;
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    return res.status(200).json(donation);
  } catch (error) {
    console.error("Error fetching donation details:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
