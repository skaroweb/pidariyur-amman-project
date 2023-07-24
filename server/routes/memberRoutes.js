const express = require("express");
const router = express.Router();
const { Member, validate } = require("../models/memberModel");

// Create a new members
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const existingUsers = await Member.find({});
    const memberCount = existingUsers.length + 1;
    const formattedMemberId = String(memberCount).padStart(4, "0");

    const newMember = new Member({
      memberId: formattedMemberId,
      ...req.body,
    });
    await newMember.save();
    // console.log(newMember);
    res.status(201).json(newMember); // Update 'newUser' to 'newMember' here
  } catch (err) {
    console.error("Error saving new member:", err);
    res.status(500).json({ error: "Failed to create user.", err });
  }
});

//GET all members:

router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    console.error("Error getting members:", err);
    res.status(500).json({ error: "Failed to get members." });
  }
});

//GET a specific member by memberId:

router.get("/:memberId", async (req, res) => {
  try {
    const member = await Member.findOne({ memberId: req.params.memberId });
    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ message: "Member not found." });
    }
  } catch (err) {
    console.error("Error getting member:", err);
    res.status(500).json({ error: "Failed to get member." });
  }
});

//UPDATE a member by memberId:
router.put("/:memberId", async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const updatedMember = await Member.findOneAndUpdate(
      { memberId: req.params.memberId },
      req.body,
      { new: true }
    );

    if (updatedMember) {
      res.json(updatedMember);
    } else {
      res.status(404).json({ message: "Member not found." });
    }
  } catch (err) {
    console.error("Error updating member:", err);
    res.status(500).json({ error: "Failed to update member." });
  }
});

//DELETE a member by memberId:

router.delete("/:memberId", async (req, res) => {
  try {
    const deletedMember = await Member.findOneAndDelete({
      memberId: req.params.memberId,
    });

    if (deletedMember) {
      res.json(deletedMember);
    } else {
      res.status(404).json({ message: "Member not found." });
    }
  } catch (err) {
    console.error("Error deleting member:", err);
    res.status(500).json({ error: "Failed to delete member." });
  }
});

module.exports = router;
