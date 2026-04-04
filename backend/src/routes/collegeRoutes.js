const express = require("express");
const {
  createCollege,
  getColleges,
} = require("../controllers/collegeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createCollege);
router.get("/", getColleges);

module.exports = router;
