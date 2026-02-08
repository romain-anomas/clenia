// backend-project/routes/parkingRecordRoutes.js
const express = require('express');
const router = express.Router();
const parkingRecordController = require('../controllers/parkingRecordController');

router.post('/entry', parkingRecordController.createEntry);
router.put('/exit/:recordId', parkingRecordController.updateExit);
router.get('/', parkingRecordController.getAllRecords);
router.get('/active', parkingRecordController.getActiveRecords);
router.get('/:recordId', parkingRecordController.getRecordById);
router.delete('/:recordId', parkingRecordController.deleteRecord);

module.exports = router;