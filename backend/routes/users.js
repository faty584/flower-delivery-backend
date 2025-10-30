const express = require('express');

const router = express.Router();

const { loginUser, signupUser, getAllUsers} = require('../controller/userController')

router.get('/', getAllUsers) // ✅ Now base route returns users
router.post('/login', loginUser)
router.post('/signup', signupUser)
router.get('/getusers', getAllUsers) // keep it if you still need it


module.exports = router