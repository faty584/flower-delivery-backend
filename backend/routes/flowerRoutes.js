
const express = require('express');
const router = express.Router();
const upload = require('../upload');

const { getAllFlowers, addFlower, deleteFlower, getFlower, updateFlower } = require('../controllers/flowerController');

// Fetch all flowers
router.get('/', getAllFlowers);

// Add a new flower (upload.single() handles one file upload)
router.post('/', upload.single("image"), addFlower);

// Delete a flower
router.delete('/:id', deleteFlower);
// Get flower
router.get('/:id', getFlower);

router.patch('/:id', upload.single("image"), updateFlower);



// Test route without file upload
router.post('/test', (req, res) => {
  res.json({ message: 'Test POST /api/flowers/test is working!' });
});

module.exports = router;
