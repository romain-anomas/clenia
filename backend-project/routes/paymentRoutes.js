// backend-project/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/daily-report', paymentController.getDailyReport);
router.get('/bill/:recordId', paymentController.generateBill);
router.get('/:paymentId', paymentController.getPaymentById);

module.exports = router;