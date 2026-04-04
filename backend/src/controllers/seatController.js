const Seat = require("../models/Seat");

// create seat (admin)
exports.createSeat = async (req, res) => {
  const { college, branch, totalSeats, category } = req.body;

  try {
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
