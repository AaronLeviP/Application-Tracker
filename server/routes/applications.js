const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', applicationController.getAllApplications);
router.post('/', applicationController.createApplication)
router.put('/:id', validateObjectId, applicationController.updateApplication);
router.delete('/:id', validateObjectId, applicationController.deleteApplication);

module.exports = router;