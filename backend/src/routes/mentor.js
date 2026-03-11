const express = require('express');
const { submitApplication, getApplications, updateApplicationStatus } = require('../controllers/mentor');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/apply', upload.single('resume'), submitApplication);
router.get('/applications', protect, authorize('admin'), getApplications);
router.put('/applications/:id', protect, authorize('admin'), updateApplicationStatus);

module.exports = router;
