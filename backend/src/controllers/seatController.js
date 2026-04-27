const Seat = require("../models/Seat");

// create seat (admin)
exports.createSeat = async (req, res) => {
  const { college, branch, totalSeats, category } = req.body;

  try {

    if (!college || !branch || !totalSeats) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (totalSeats <= 0) {
      return res.status(400).json({ message: "Seats must be greater than 0" });
    }


    const seat = await Seat.create({
      college,
      branch,
      totalSeats,
      availableSeats: totalSeats,
      category,
    });

    res.status(201).json(seat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all seats
exports.getSeats = async (req, res) => {
  try {
    const seats = await Seat.find().populate("college", "name location");
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// delete seat
exports.deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);

    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    await Seat.findByIdAndDelete(req.params.id);

    res.json({ message: "Seat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};