const Admin = require("../models/admin_model");
const bcrypt = require('bcrypt');

const registerAdmin = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const emailExists = await Admin.findOne({ email });

    if (emailExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully", data: newAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const AdminExists = await Admin.findOne({ email });

    if (!AdminExists) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, AdminExists.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Successful login
    res.status(200).json({ message: "Login successful", data: AdminExists });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};
