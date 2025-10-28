// backend/routes/flowerRoutes.js
const express = require('express');
const router = express.Router();
const { addFlower, getAllFlowers } = require('../controllers/flowerController');
const { upload } = require('../config/cloudinary');

// ✅ Correct usage: upload.single('image') is middleware, addFlower is the handler
router.post('/', upload.single('image'), addFlower);

// ✅ Correct usage: just pass the function reference
router.get('/', getAllFlowers);

module.exports = router;
