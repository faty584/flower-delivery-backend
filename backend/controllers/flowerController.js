const Flower = require('../models/flowerModels');

// Get all flowers
const getAllFlowers = async (req, res) => {
  try {
    const flowers = await Flower.find();
    res.status(200).json(flowers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new flower
const addFlower = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    const image = req.file ? req.file.filename : null; // Get image filename from Multer

    // Basic validation
    if (!name || !category || !price || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newFlower = new Flower({
      name,
      category,
      price,
      image // store only filename, not full path
    });

    const savedFlower = await newFlower.save();
    res.status(201).json(savedFlower);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};
//Get flower
const getFlower = async (req, res) => {
  try {
    const flower = await Flower.findById(req.params.id); // pass the ID
    if (!flower) {
      return res.status(404).json({ error: 'Flower not found' });
    }
    res.status(200).json(flower);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update a flower by ID
const updateFlower = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    const image = req.file ? req.file.filename : undefined; // optional update

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (price) updateData.price = price;
    if (image) updateData.image = image;

    const updatedFlower = await Flower.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // return updated document
    );

    if (!updatedFlower) {
      return res.status(404).json({ error: 'Flower not found' });
    }

    res.status(200).json(updatedFlower);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = { getAllFlowers, addFlower, deleteFlower, getFlower, updateFlower  };
