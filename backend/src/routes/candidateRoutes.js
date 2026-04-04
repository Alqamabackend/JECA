const express = require("express");
const {
  createCandidate,
  getMyProfile, getAllCandidates
} = require("../controllers/candidateController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createCandidate);
router.get("/me", protect, getMyProfile);
router.get("/all", protect, getAllCandidates);

module.exports = router;
