// backend-project/routes/carRoutes.js
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/', carController.createCar);
router.get('/', carController.getAllCars);
router.get('/:plateNumber', carController.getCarByPlate);
router.put('/:plateNumber', carController.updateCar);
router.delete('/:plateNumber', carController.deleteCar);

module.exports = router;