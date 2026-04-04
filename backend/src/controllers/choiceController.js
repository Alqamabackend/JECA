const Choice = require("../models/Choice");
const Candidate = require("../models/Candidate");

// add choice
exports.addChoice = async (req, res) => {
  const { seat, priority } = req.body;

  try {
    const candidate = await Candidate.findOne({ user: req.user._id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const choice = await Choice.create({
      candidate: candidate._id,
      seat,
      priority,
    });

    res.status(201).json(choice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get my choices
exports.getMyChoices = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user._id });

    // console.log("Logged User:", req.user._id);
    // console.log("Candidate Found:", candidate?._id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const choices = await Choice.find({ candidate: candidate._id })
      .populate({
        path: "seat",
        populate: { path: "college", select: "name location" },
      })
      .sort({ priority: 1 });

    // console.log("Choices Found:", choices.length);

    res.json(choices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteChoice = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user._id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const choice = await Choice.findById(req.params.id);

    if (!choice) {
      return res.status(404).json({ message: "Choice not found" });
    }

    // Compare with candidate._id (NOT user._id)
    if (choice.candidate.toString() !== candidate._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await choice.deleteOne();

    res.json({ message: "Choice removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addChoice = async (req, res) => {
  try {
    const { seat, priority } = req.body;

    const candidate = await Candidate.findOne({ user: req.user._id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // 🔒 Check duplicate seat
    const existingSeat = await Choice.findOne({
      candidate: candidate._id,
      seat: seat,
    });

    if (existingSeat) {
      return res
        .status(400)
        .json({ message: "You already selected this seat" });
    }

    // 🔒 Check duplicate priority
    const existingPriority = await Choice.findOne({
      candidate: candidate._id,
      priority: priority,
    });

    if (existingPriority) {
      return res
        .status(400)
        .json({ message: "Priority already used" });
    }

    const choice = await Choice.create({
      candidate: candidate._id,
      seat,
      priority,
    });

    res.status(201).json(choice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};