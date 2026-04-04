const app = require("./src/app");
const connectDB = require("./src/config/db");
require("dotenv").config();

// database connect
connectDB();

const PORT = process.env.PORT || 5000;
app.use((err, req, res, next) => {
  console.error(err);  // Log the error to the console
  res.status(500).json({ message: err.message });  // Send a generic error message to the client
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
