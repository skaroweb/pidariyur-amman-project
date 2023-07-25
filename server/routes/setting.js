const express = require("express");
const router = express.Router();
const titleModel = require("../models/setting"); // Assuming you have a Mongoose model for the title

router.get("/", async (req, res) => {
  try {
    const title = await titleModel.find({});
    res.send(title);

    // console.log(title);
  } catch (err) {
    console.log(err);
  }
});

// // Route to update a specific title
// router.put("/", async (req, res) => {
//   try {
//     const id = "64b9264a938e68c10530a88e";
//     // Update the title in the database using your Mongoose model
//     const updatedTitle = await titleModel.findByIdAndUpdate(id, {
//       title: req.body.title,
//     });
//     //console.log(updatedTitle);
//     //res.send(updatedTitle);
//     res.status(200).json({ message: "Title updated successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update title" });
//   }
// });

// Define the initial title data (just for demonstration purposes)
let titleData = {
  title: "Initial Title",
};

// Define the PUT route to update the title
router.put("/", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  const updatedTitle = await titleModel.updateOne({
    title: title,
  });

  res.send(updatedTitle);
});

module.exports = router;
