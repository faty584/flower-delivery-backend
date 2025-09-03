const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// create token helper
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '1d' });
};

// Signup
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // use the static signUp function from userModel.js
    const user = await User.signUp(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw Error("Incorrect email");
    }

    // compare password with bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw Error("Incorrect password");
    }

    // create token
    const token = createToken(user._id);

    res.status(200).json({ email: user.email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'email'); // don’t return password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { loginUser, signupUser, getAllUsers };
