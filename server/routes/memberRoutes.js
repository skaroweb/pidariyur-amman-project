const express = require("express");
const router = express.Router();
const { Member, validate } = require("../models/memberModel");

// Create a new members
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { phoneNumber, alternatePhoneNumber } = req.body;

    // Check if the phone number already exists in the database
    let query = {
      phoneNumber: phoneNumber,
    };

    if (alternatePhoneNumber && alternatePhoneNumber.trim() !== "") {
      query["$or"] = [
        { phoneNumber: phoneNumber },
        { alternatePhoneNumber: phoneNumber },
      ];
    }

    const existingMember = await Member.findOne(query);

    if (existingMember) {
      return res.status(400).send({ message: "Phone number already exists." });
    }

    const existingUsers = await Member.find({});

    const newMember = new Member({
      // memberId: formattedMemberId,
      ...req.body,
    });
    await newMember.save();
    //console.log(newMember);
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

// Route to get specific donation details by ID
router.get("/:id", async (req, res) => {
  try {
    const memberId = req.params.id;
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.status(200).json(member);
  } catch (error) {
    console.error("Error fetching member details:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//UPDATE a member by memberId:
// router.put("/:id", async (req, res) => {
//   try {
//     const { error } = validate(req.body);

//     if (error)
//       return res.status(400).send({ message: error.details[0].message });

//     const updatedMember = await Member.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     if (updatedMember) {
//       res.json(updatedMember);
//     } else {
//       res.status(404).json({ message: "Member not found." });
//     }
//   } catch (err) {
//     console.error("Error updating member:", err);
//     res.status(500).json({ error: "Failed to update member." });
//   }
// });

router.put("/:id", async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { phoneNumber, alternatePhoneNumber } = req.body;

    // Check if the phone number already exists in the database
    let query = {
      $or: [
        { phoneNumber: phoneNumber },
        { phoneNumber: alternatePhoneNumber },
      ],
      _id: { $ne: req.params.id }, // Exclude the current document being updated
    };

    const existingMember = await Member.findOne(query);

    if (existingMember) {
      return res.status(400).send({ message: "Phone number already exists." });
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
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

router.delete("/:id", async (req, res) => {
  try {
    // console.log(req.params.memberId);
    const deletedMember = await Member.findByIdAndDelete(req.params.id);

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
