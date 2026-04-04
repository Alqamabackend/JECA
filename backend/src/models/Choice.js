const mongoose = require("mongoose");

const choiceSchema = new mongoose.Schema(
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

    priority: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Choice", choiceSchema);
