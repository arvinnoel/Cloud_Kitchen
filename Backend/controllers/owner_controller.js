const Owner = require("../models/owner_model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerOwner = async (req, res) => {
  const { name, kitchen_name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const emailExists = await Owner.findOne({ email });

    if (emailExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOwner = await Owner.create({
      name,
      kitchen_name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Owner registered successfully", data: newOwner,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const loginOwner = async (req, res) => {
  const { email, password } = req.body;

  try {
    const ownerExists = await Owner.findOne({ email });
    if (!ownerExists) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, ownerExists.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { ownerId: ownerExists._id, email: ownerExists.email },
      process.env.JWT_SECRET, // Use your secret key from the environment
      { expiresIn: '1h' } 
    );

    res.status(200).json({
      message: "Login successful",
      data: {
        owner: ownerExists, 
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerOwner,
  loginOwner,
};
