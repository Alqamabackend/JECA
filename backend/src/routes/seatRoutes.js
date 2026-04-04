const express = require("express");
const {
  createSeat,
  getSeats,
} = require("../controllers/seatController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createSeat);
router.get("/", getSeats);

module.exports = router;
