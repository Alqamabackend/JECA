const express = require("express");
const { runAllotment , getMyAllotment , getAllAllotments , resetAllotment , acceptSeat , exportAllotments } = require("../controllers/allotmentController");
const adminOnly = require("../middleware/roleMiddleware");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/run", protect, runAllotment);
router.get("/my", protect, getMyAllotment);
router.get("/all", protect, adminOnly, getAllAllotments);
router.post("/reset", protect, resetAllotment);
router.post("/accept", protect, acceptSeat);
router.get("/export", protect, exportAllotments);

module.exports = router;
