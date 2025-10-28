const Flower = require("../models/flowerModel");
const mongoose = require("mongoose");
const cloudinary = require("../cloudinary");
const fs = require("fs");

// ✅ Get all flowers
const getAllFlowers = async (req, res) => {
  try {
    const flowers = await Flower.find().sort({ createdAt: -1 });
    res.status(200).json({ flowers });
  } catch (error) {
    console.error("Get all flowers error:", error);
    res.status(500).json({ error: "Failed to fetch flowers" });
  }
};

// ✅ Get a single flower
const getFlower = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid flower ID" });
  }

  try {
    const flower = await Flower.findById(id);
    if (!flower) {
      return res.status(404).json({ error: "Flower not found" });
    }
    res.status(200).json(flower);
  } catch (error) {
    console.error("Get flower error:", error);
    res.status(500).json({ error: "Failed to get flower" });
  }
};

// ✅ Add a new flower
const addFlower = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let imageUrl = null;

    console.log("Uploaded file:", req.file);

    // If an image was uploaded
    if (req.file && req.file.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "flowers",
      });
      imageUrl = uploadResult.secure_url;

      // delete temp file
      fs.unlink(req.file.path, (err) => {
        if (err) console.warn("Failed to remove temp file:", err);
      });
    }

    if (!imageUrl) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    const flower = new Flower({
      name,
      description,
      price,
      category,
      image: imageUrl,
    });

    const savedFlower = await flower.save();
    res.status(201).json(savedFlower);
  } catch (error) {
    console.error("Create flower error:", error);
    res.status(500).json({ error: "Failed to create flower" });
  }
};

// ✅ Update a flower
const updateFlower = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid flower ID" });
  }

  try {
    const { name, description, price, category } = req.body;
    const updateData = { name, description, price, category };

    // If new image uploaded
    if (req.file && req.file.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "flowers",
      });
      updateData.image = uploadResult.secure_url;

      fs.unlink(req.file.path, (err) => {
        if (err) console.warn("Failed to remove temp file:", err);
      });
    }

    const updatedFlower = await Flower.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedFlower) {
      return res.status(404).json({ error: "Flower not found" });
    }

    res.status(200).json(updatedFlower);
  } catch (error) {
    console.error("Update flower error:", error);
    res.status(500).json({ error: "Failed to update flower" });
  }
};

// ✅ Delete a flower
const deleteFlower = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid flower ID" });
  }

  try {
    const flower = await Flower.findByIdAndDelete(id);
    if (!flower) {
      return res.status(404).json({ error: "Flower not found" });
    }

    res.status(200).json({ message: "Flower deleted successfully" });
  } catch (error) {
    console.error("Delete flower error:", error);
    res.status(500).json({ error: "Failed to delete flower" });
  }
};

// ✅ Get 4 random flowers
const getRandomFlowers = async (req, res) => {
  try {
    const flowers = await Flower.aggregate([{ $sample: { size: 4 } }]);
    res.status(200).json({ flowers });
  } catch (error) {
    console.error("Get random flowers error:", error);
    res.status(500).json({ error: "Failed to fetch random flowers" });
  }
};

module.exports = {
  getAllFlowers,
  getFlower,
  addFlower,
  updateFlower,
  deleteFlower,
  getRandomFlowers,
};
