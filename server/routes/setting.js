// routes/settings.js
const express = require("express");
const router = express.Router();
const Setting = require("../models/setting"); // Assuming you have a Setting model

// Route to get the current setting
router.get("/", async (req, res) => {
  try {
    const setting = await Setting.findOne();
    res.json(setting);
  } catch (error) {
    console.error("Error fetching setting:", error);
    res.status(500).json({ error: "Failed to fetch setting" });
  }
});

// Route to update the setting
router.put("/", async (req, res) => {
  try {
    const newTitle = req.body.title; // Assuming the request body contains the new title
    const setting = await Setting.findOneAndUpdate(
      {},
      { title: newTitle },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (error) {
    console.error("Error updating setting:", error);
    res.status(500).json({ error: "Failed to update setting" });
  }
});

module.exports = router;
