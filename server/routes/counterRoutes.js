const express = require("express");
const router = express.Router();
const Counter = require("../models/donationCounter.model"); // Replace the path with the correct path to the counter.model.js file.

// GET API to fetch the counter data
router.get("/", async (req, res) => {
  try {
    // Fetch the counter document with _id set to "memberId"
    const counterDoc = await Counter.findById("donationId");

    if (!counterDoc) {
      // If the counter document doesn't exist, create a new one with _id set to "memberId"
      const newCounter = await Counter.create({ _id: "donationId", seq: 0 });

      // Return the newly created counter document
      return res.status(200).json({ counter: newCounter });
    }

    // Return the counter document
    res.status(200).json({ counter: counterDoc });
  } catch (error) {
    console.error("Error fetching counter:", error);
    res.status(500).json({ error: "Failed to fetch counter." });
  }
});

module.exports = router;
