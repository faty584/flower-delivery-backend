const Flower = require("../models/flowerModel");

// ✅ Add new flower (Cloudinary version)
const addFlower = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        error: "Please upload an image",
      });
    }

    const { name, category, description, price } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, category and price",
      });
    }

    // ✅ req.file.path is the Cloudinary URL
    const flower = await Flower.create({
      name,
      category,
      description,
      price: parseFloat(price),
      image: req.file.path,
    });

    res.status(201).json({
      success: true,
      message: "Flower added successfully",
      data: flower,
    });
  } catch (error) {
    console.error("❌ Error creating flower:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create flower",
    });
  }
};

// ✅ Get all flowers
const getAllFlowers = async (req, res) => {
  try {
    const flowers = await Flower.find().sort({ createdAt: -1 });
    res.status(200).json(flowers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addFlower, getAllFlowers };
