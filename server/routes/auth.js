const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
const { registerValidation, loginValidation, validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.post('/login', loginValidation, validate, authenticationController.loginUser);
router.post('/register', registerValidation, validate, authenticationController.registerUser);

router.get('/me', auth, authenticationController.getCurrentUser);

module.exports = router;