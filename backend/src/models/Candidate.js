const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rank: {
      type: Number,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      enum: ["GEN", "OBC", "SC", "ST"],
      required: true,
    },

    qualification: {
      type: String,
      required: true,
    },

    domicile: {
      type: String,
      default: "West Bengal",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
