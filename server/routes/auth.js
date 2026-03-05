const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
const { updateProfileValidation, changePasswordValidation, registerValidation, loginValidation, validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.post('/login', loginValidation, validate, authenticationController.loginUser);
router.post('/register', registerValidation, validate, authenticationController.registerUser);

router.post('/profile', updateProfileValidation, validate, authenticationController.updateProfile);
router.post('/password', changePasswordValidation, validate, authenticationController.changePassword);

router.get('/me', auth, authenticationController.getCurrentUser);

module.exports = router;