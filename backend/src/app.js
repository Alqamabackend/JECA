const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const seatRoutes = require("./routes/seatRoutes");
const choiceRoutes = require("./routes/choiceRoutes");
const allotmentRoutes = require("./routes/allotmentRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/college", collegeRoutes);
app.use("/api/seat", seatRoutes);
app.use("/api/choice", choiceRoutes);
app.use("/api/allotment", allotmentRoutes);


// test route
app.use((err, req, res, next) => {
  console.error(err);  // Log the error to the console
  res.status(500).json({ message: err.message });  // Send a generic error message to the client
});
app.get("/", (req, res) => {
    res.send("JECA Seat Allotment Backend Running");
});

module.exports = app;
