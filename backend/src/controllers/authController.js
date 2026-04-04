const bcrypt = require('bcryptjs');
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password manually in the controller
    const salt = await bcrypt.genSalt(10);  // Salt generate karte hain
    const hashedPassword = await bcrypt.hash(password, salt);  // Password ko hash karte hain

    // Create the user with the hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword,  // Use the hashed password
      role,
    });

    // Send the response with the token
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // User ko email se find karna
    const user = await User.findOne({ email });

    // Agar user exist karta hai, aur password match hota hai
    if (user) {
      // Compare entered password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Agar passwords match karte hain, token generate karna aur user details bhejna
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};