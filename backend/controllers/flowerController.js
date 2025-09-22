const Flower = require('../models/flowerModel');

// Get all flowers
const getAllFlowers = async (req, res) => {
  try {
    const flowers = await Flower.find();
    res.status(200).json(flowers);
  } catch (error) {
    console.error("❌ Error in getAllFlowers:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add a new flower
const addFlower = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validation
    if (!name || !category || !price || !description || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newFlower = new Flower({
      name,
      category,
      price,
      description,
      image, // only filename, not full path
    });

    const savedFlower = await newFlower.save();
    res.status(201).json(savedFlower);
  } catch (error) {
    console.error("❌ Error in addFlower:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a flower
const deleteFlower = async (req, res) => {
  try {
    const deletedFlower = await Flower.findByIdAndDelete(req.params.id);
    if (!deletedFlower) {
      return res.status(404).json({ error: 'Flower not found' });
    }
    res.status(200).json({ message: 'Flower deleted successfully', deletedFlower });
  } catch (error) {
    console.error("❌ Error in deleteFlower:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get flower by ID
const getFlower = async (req, res) => {
  try {
    const flower = await Flower.findById(req.params.id);
    if (!flower) {
      return res.status(404).json({ error: 'Flower not found' });
    }
    res.status(200).json(flower);
  } catch (error) {
    console.error("❌ Error in getFlower:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update flower
const updateFlower = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (price) updateData.price = price;
    if (description) updateData.description = description;
    if (image) updateData.image = image;

    const updatedFlower = await Flower.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFlower) {
      return res.status(404).json({ error: 'Flower not found' });
    }

    res.status(200).json(updatedFlower);
  } catch (error) {
    console.error("❌ Error in updateFlower:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllFlowers, addFlower, deleteFlower, getFlower, updateFlower };
