const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const validateObjectId = require('../middleware/validateObjectId');
const { applicationValidation, validate } = require('../middleware/validators');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', applicationController.getAllApplications);
router.post('/', applicationValidation, validate, applicationController.createApplication)
router.put('/:id', validateObjectId, applicationValidation, validate, applicationController.updateApplication);
router.delete('/:id', validateObjectId, applicationController.deleteApplication);

module.exports = router;