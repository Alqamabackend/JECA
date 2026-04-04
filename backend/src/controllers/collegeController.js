const College = require("../models/College");

// create college
exports.createCollege = async (req, res) => {
  const { name, location } = req.body;

  try {
    const college = await College.create({
      name,
      location,
    });

    res.status(201).json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all colleges
exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
