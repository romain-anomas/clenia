// backend-project/routes/parkingSlotRoutes.js
const express = require('express');
const router = express.Router();
const parkingSlotController = require('../controllers/parkingSlotController');

router.post('/', parkingSlotController.createSlot);
router.get('/', parkingSlotController.getAllSlots);
router.get('/available', parkingSlotController.getAvailableSlots);
router.put('/:slotNumber', parkingSlotController.updateSlot);
router.delete('/:slotNumber', parkingSlotController.deleteSlot);

module.exports = router;