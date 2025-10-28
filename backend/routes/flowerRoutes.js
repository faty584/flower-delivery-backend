const express = require("express");
const router = express.Router();
const { upload } = require("../cloudinary");
const {
  getAllFlowers,
  getFlower,
  addFlower,
  updateFlower,
  deleteFlower,
  getRandomFlowers,
} = require("../controllers/flowerController");

router.get("/", getAllFlowers);
router.get("/random", getRandomFlowers);
router.get("/:id", getFlower);
router.post("/", upload.single("image"), addFlower);
router.patch("/:id", upload.single("image"), updateFlower);
router.delete("/:id", deleteFlower);

module.exports = router;
