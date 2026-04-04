const Candidate = require("../models/Candidate");
const Choice = require("../models/Choice");
const Seat = require("../models/Seat");
const Allotment = require("../models/Allotment");

exports.runAllotment = async (req, res) => {
  try {
    // 1️⃣ rank wise candidates sort karo
    const candidates = await Candidate.find().sort({ rank: 1 });

    for (let candidate of candidates) {

      // check already allotted
      const alreadyAllotted = await Allotment.findOne({
        candidate: candidate._id,
      });
      // console.log("Checking Candidate Rank:", candidate.rank);

      if (alreadyAllotted) continue;

      // 2️⃣ candidate ke choices priority wise lo
      const choices = await Choice.find({
        candidate: candidate._id,
      }).sort({ priority: 1 });

      // console.log("Choices Found:", choices.length);

      for (let choice of choices) {

        const seat = await Seat.findById(choice.seat);
        // console.log("Seat Available:", seat?.availableSeats);

        if (seat && seat.availableSeats > 0) {

          // 3️⃣ seat allot karo
          await Allotment.create({
            candidate: candidate._id,
            seat: seat._id,
          });

          // 4️⃣ availableSeats kam karo
          seat.availableSeats -= 1;
          await seat.save();

          break; // move to next candidate
        }
      }
    }

    res.json({ message: "Allotment Completed" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyAllotment = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user._id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const allotment = await Allotment.findOne({
      candidate: candidate._id,
    }).populate({
      path: "seat",
      populate: { path: "college", select: "name location" },
    });

    if (!allotment) {
      return res.status(404).json({ message: "No seat allotted yet" });
    }

    res.json(allotment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAllotments = async (req, res) => {
  try {
    const allotments = await Allotment.find()
      .populate({
        path: "candidate",
        populate: { path: "user", select: "name email" },
      })
      .populate({
        path: "seat",
        populate: { path: "college", select: "name location" },
      });

    res.json(allotments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetAllotment = async (req, res) => {
  try {
    // 1️⃣ Delete all allotments
    await Allotment.deleteMany({});

    // 2️⃣ Reset all seats availability
    const seats = await Seat.find();

    for (let seat of seats) {
      seat.availableSeats = seat.totalSeats;
      await seat.save();
    }

    res.json({ message: "Allotment Reset Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptSeat = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user._id });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const allotment = await Allotment.findOne({
      candidate: candidate._id,
    });

    if (!allotment) {
      return res.status(404).json({ message: "No allotment found" });
    }

    allotment.status = "ACCEPTED";
    await allotment.save();

    res.json({ message: "Seat Accepted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportAllotments = async (req, res) => {
  try {
    const allotments = await Allotment.find()
      .populate({
        path: "candidate",
        populate: { path: "user", select: "name email" },
      })
      .populate({
        path: "seat",
        populate: { path: "college", select: "name" },
      });

    let csv = "Name,Email,Rank,Category,Branch,College,Status\n";

    allotments.forEach((a) => {
      csv += `${a.candidate.user.name},`;
      csv += `${a.candidate.user.email},`;
      csv += `${a.candidate.rank},`;
      csv += `${a.candidate.category},`;
      csv += `${a.seat.branch},`;
      csv += `${a.seat.college.name},`;
      csv += `${a.status}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("allotment-results.csv");
    return res.send(csv);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};