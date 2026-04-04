const express = require("express");
const {
  addChoice,
  getMyChoices,
  deleteChoice,
} = require("../controllers/choiceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addChoice);
router.get("/my", protect, getMyChoices);
router.delete("/:id", protect, deleteChoice);

module.exports = router;
