const Flower = require('../model/flowerModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../util/Cloudinary');

// ===================== MULTER CONFIG =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // temporary local storage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ===================== GET ALL FLOWERS =====================
const getFlowers = async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { Category: new RegExp(`^${category}$`, 'i') } : {};
    const flowers = await Flower.find(filter).sort({ createdAt: -1 });
    res.status(200).json(flowers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ===================== GET SINGLE FLOWER =====================
const getFlower = async (req, res) => {
  const { id } = req.params;
  try {
    const flower = await Flower.findById(id);
    if (!flower) return res.status(404).json({ error: 'No such flower' });
    res.status(200).json(flower);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ===================== CREATE NEW FLOWER (UPLOAD TO CLOUDINARY) =====================
const createFlower = async (req, res) => {
  const { Title, Description, Price, Category } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'flowers',
    });

    // Delete the temporary local file
    fs.unlinkSync(req.file.path);

    // Create new flower document
    const flower = await Flower.create({
      Title,
      Description,
      Price,
      Category,
      Image: result.secure_url, // Cloudinary image URL
    });

    res.status(201).json(flower);
  } catch (error) {
    console.error('Error creating flower:', error);
    res.status(400).json({ error: error.message });
  }
};

// ===================== DELETE FLOWER =====================
const deleteFlower = async (req, res) => {
  const { id } = req.params;
  try {
    const flower = await Flower.findById(id);
    if (!flower) return res.status(404).json({ error: 'Flower not found' });

    // Delete flower document
    await Flower.findByIdAndDelete(id);

    res.status(200).json({ message: 'Flower deleted successfully' });
  } catch (error) {
    console.error('Error deleting flower:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ===================== UPDATE FLOWER =====================
const updateFlower = async (req, res) => {
  const { id } = req.params;
  const { Title, Description, Price, Category } = req.body;

  try {
    const flower = await Flower.findById(id);
    if (!flower) return res.status(404).json({ error: 'Flower not found' });

    let newImageUrl = flower.Image;

    if (req.file) {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'flowers',
      });

      // Delete temporary file
      fs.unlinkSync(req.file.path);

      // Update image URL
      newImageUrl = result.secure_url;
    }

    const updatedFlower = await Flower.findByIdAndUpdate(
      id,
      {
        Title: Title || flower.Title,
        Description: Description || flower.Description,
        Price: Price || flower.Price,
        Category: Category || flower.Category,
        Image: newImageUrl,
      },
      { new: true }
    );

    res.status(200).json(updatedFlower);
  } catch (error) {
    console.error('Error updating flower:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ===================== EXPORTS =====================
module.exports = {
  getFlowers,
  getFlower,
  createFlower,
  deleteFlower,
  updateFlower,
  upload,
};
