const Candidate = require("../models/Candidate");

// create candidate profile
exports.createCandidate = async (req, res) => {
  const { rank, category, qualification } = req.body;

  try {
    const candidateExists = await Candidate.findOne({ user: req.user._id });
    if (candidateExists) {
      return res.status(400).json({ message: "Candidate profile already exists" });
    }

    const candidate = await Candidate.create({
      user: req.user._id,
      rank,
      category,
      qualification,
    });
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get logged-in candidate profile
// exports.getMyProfile = async (req, res) => {
//   try {
//     const candidate = await Candidate.findOne({ user: req.user._id }).populate(
//       "user",
//       "name email role"
//     );

//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }

//     res.json(candidate);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.getMyProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user._id });

    if (!candidate) {
      return res.json({ profileCompleted: false });
    }

    res.json({
      profileCompleted: true,
      ...candidate._doc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate("user", "name email")
      .sort({ rank: 1 });

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};