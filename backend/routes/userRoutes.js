
const express = require('express');

const router = express.Router();

const { loginUser, signupUser, getAllUsers} = require('../controllers/userControllers')

router.get('/', getAllUsers);      // GET /api/users
router.post('/signup', signupUser) // POST /api/users/signup
router.post('/login', loginUser)   // POST /api/users/login


module.exports = router
