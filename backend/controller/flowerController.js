const Flower = require('../model/flowerModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../util/Cloudinary');
const os = require('os');

// ===================== MULTER CONFIG =====================
// Use system temp directory instead of 'uploads/' for Render compatibility
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpDir = os.tmpdir();
    console.log('📂 Using temp directory:', tmpDir);
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    console.log('📝 Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage });

// ===================== GET ALL FLOWERS =====================
const getFlowers = async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category: new RegExp(`^${category}$`, 'i') } : {};
    const flowers = await Flower.find(filter).sort({ createdAt: -1 });
    res.status(200).json(flowers);
  } catch (error) {
    console.error('Error getting flowers:', error);
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
    console.error('Error getting flower:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ===================== CREATE NEW FLOWER (UPLOAD TO CLOUDINARY) =====================
const createFlower = async (req, res) => {
  console.log('=== CREATE FLOWER REQUEST STARTED ===');
  console.log('📝 Body:', req.body);
  console.log('📁 File:', req.file ? 'File present' : 'No file');
  
  const { name, description, price, category } = req.body;

  try {
    if (!req.file) {
      console.log('❌ ERROR: No file in request');
      return res.status(400).json({ error: 'Image file is required' });
    }

    console.log('✅ File check passed');
    console.log('📂 File path:', req.file.path);
    console.log('☁️ Starting Cloudinary upload...');

    // Upload the file to Cloudinary with timeout protection
    const result = await Promise.race([
      cloudinary.uploader.upload(req.file.path, {
        folder: 'flowers',
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Cloudinary upload timeout after 30s')), 30000)
      )
    ]);

    console.log('✅ Cloudinary upload SUCCESS');
    console.log('🖼️ Image URL:', result.secure_url);

    // Delete the temporary local file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('🗑️ Temp file deleted');
    }

    console.log('💾 Creating database entry...');

    // Create new flower document with lowercase fields
    const flower = await Flower.create({
      name,
      description,
      price,
      category,
      image: result.secure_url, // Cloudinary image URL
    });

    console.log('✅ Database entry created:', flower._id);
    console.log('=== REQUEST COMPLETED SUCCESSFULLY ===');

    res.status(201).json(flower);
    
  } catch (error) {
    console.error('❌ ERROR in createFlower:', error.message);
    console.error('❌ Full error:', error);
    
    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Temp file cleaned up after error');
      } catch (cleanupError) {
        console.error('⚠️ Could not delete temp file:', cleanupError);
      }
    }
    
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
  const { name, description, price, category } = req.body;

  try {
    const flower = await Flower.findById(id);
    if (!flower) return res.status(404).json({ error: 'Flower not found' });

    let newImageUrl = flower.image;

    if (req.file) {
      console.log('📂 Uploading new image to Cloudinary...');
      
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'flowers',
      });

      console.log('✅ New image uploaded:', result.secure_url);

      // Delete temporary file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      // Update image URL
      newImageUrl = result.secure_url;
    }

    const updatedFlower = await Flower.findByIdAndUpdate(
      id,
      {
        name: name || flower.name,
        description: description || flower.description,
        price: price || flower.price,
        category: category || flower.category,
        image: newImageUrl,
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