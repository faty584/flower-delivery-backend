const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { getAllFlowers, addFlower, deleteFlower, getFlower, updateFlower } = require('../controllers/flowerController');

// Setup Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save files in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.get('/', getAllFlowers);
router.post('/', upload.single('image'), addFlower); // ✅ apply Multer here
router.get('/:id', getFlower);
router.delete('/:id', deleteFlower);
router.put('/:id', upload.single('image'), updateFlower);

module.exports = router;
