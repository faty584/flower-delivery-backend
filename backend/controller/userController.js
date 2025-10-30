const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '1day' });
};

// ✅ USER LOGIN
const loginUser = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    if (!Email || !Password) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(400).json({ error: "Incorrect email or password" });
    }

    const match = await bcrypt.compare(Password, user.Password);
    if (!match) {
      return res.status(400).json({ error: "Incorrect email or password" });
    }

    const token = createToken(user._id);

    res.status(200).json({ Email: user.Email, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ SIGNUP
const signupUser = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await User.signUp(Email, Password);
    const token = createToken(user._id);

    res.status(200).json({ Email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all users (optional admin route)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'Email');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { loginUser, signupUser, getAllUsers };
