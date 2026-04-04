const mongoose = require("mongoose");

const allotmentSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    seat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },
    status: {
      type: String,
      enum: ["ALLOTTED", "ACCEPTED"],
      default: "ALLOTTED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Allotment", allotmentSchema);
