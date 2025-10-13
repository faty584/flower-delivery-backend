const express = require('express');
const router = express.Router();
const { upload } = require('../cloudinary');  // ✅ keep this only

const { getAllFlowers, addFlower, deleteFlower, getFlower, updateFlower } = require('../controllers/flowerController');

// Routes
router.get('/', getAllFlowers);
router.post('/', upload.single('Image'), addFlower);
router.get('/:id', getFlower);
router.delete('/:id', deleteFlower);
router.put('/:id', upload.single('Image'), updateFlower);

module.exports = router;
