const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    totalSeats: {
      type: Number,
      required: true,
    },

    availableSeats: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["GEN", "OBC", "SC", "ST"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seat", seatSchema);
