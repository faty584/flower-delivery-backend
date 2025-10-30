const express = require('express');
const router = express.Router();
const {
  createFlower,
  getFlowers,
  getFlower,
  deleteFlower,
  updateFlower,
  upload,
} = require('../controller/flowerController'); // ✅ corrected folder name: "controllers", not "controller"

// ✅ Get all flowers (optionally filter by category)
router.get('/', getFlowers);

// ✅ Get a single flower by ID
router.get('/:id', getFlower);

// ✅ Create a new flower (with image upload)
router.post('/', upload.single('Image'), createFlower);

// ✅ Delete a flower
router.delete('/:id', deleteFlower);

// ✅ Update flower details (and replace image if uploaded)
router.patch('/:id', upload.single('Image'), updateFlower);

module.exports = router;
