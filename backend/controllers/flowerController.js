const Flower = require('../models/flowerModel');

// ✅ Add new flower
const addFlower = async (req, res) => {
  try {
    console.log('Uploaded file:', req.file);

    // Multer + Cloudinary automatically uploads and returns the file path
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image upload failed' });
    }

    const { name, category, description, price } = req.body;

    const flower = await Flower.create({
      name,
      category,
      description,
      price,
      image: imageUrl, // ✅ Save the Cloudinary URL
    });

    res.status(201).json({ message: 'Flower added successfully', flower });
  } catch (error) {
    console.error('Create flower error:', error);
    res.status(500).json({ error: error.message });
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
