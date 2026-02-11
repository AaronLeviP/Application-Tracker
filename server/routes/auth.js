const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
const { registerValidation, loginValidation, validate } = require('../middleware/validateAuth');

router.post('/login', loginValidation, validate, authenticationController.loginUser);
router.post('/register', registerValidation, validate, authenticationController.registerUser);

module.exports = router;