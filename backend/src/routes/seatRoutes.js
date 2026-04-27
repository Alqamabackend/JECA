const express = require("express");
const {
  createSeat,
  getSeats,
  deleteSeat,
} = require("../controllers/seatController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createSeat);
router.get("/", getSeats);
router.delete("/:id", deleteSeat);

module.exports = router;
