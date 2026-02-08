// backend-project/controllers/paymentController.js
const db = require('../config/db');

// Create Payment
exports.createPayment = (req, res) => {
    const { RecordID, AmountPaid, PaymentDate } = req.body;

    db.query(
        'INSERT INTO payments (RecordID, AmountPaid, PaymentDate) VALUES (?, ?, ?)',
        [RecordID, AmountPaid, PaymentDate],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            res.status(201).json({ 
                message: 'Payment recorded successfully',
                paymentId: result.insertId 
            });
        }
    );
};

// Get All Payments
exports.getAllPayments = (req, res) => {
    const query = `
        SELECT p.*, pr.PlateNumber, pr.EntryTime, pr.ExitTime, pr.Duration,
               c.DriverName, c.PhoneNumber
        FROM payments p
        JOIN parkingrecords pr ON p.RecordID = pr.RecordID
        JOIN cars c ON pr.PlateNumber = c.PlateNumber
        ORDER BY p.PaymentDate DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
};

// Get Payment by ID
exports.getPaymentById = (req, res) => {
    const { paymentId } = req.params;
    
    const query = `
        SELECT p.*, pr.PlateNumber, pr.EntryTime, pr.ExitTime, pr.Duration,
               c.DriverName, c.PhoneNumber
        FROM payments p
        JOIN parkingrecords pr ON p.RecordID = pr.RecordID
        JOIN cars c ON pr.PlateNumber = c.PlateNumber
        WHERE p.PaymentID = ?
    `;
    
    db.query(query, [paymentId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Payment not found' });
        res.json(results[0]);
    });
};

// Get Daily Report
exports.getDailyReport = (req, res) => {
    const { date } = req.query; // Format: YYYY-MM-DD
    
    let query = `
        SELECT p.*, pr.PlateNumber, pr.EntryTime, pr.ExitTime, pr.Duration,
               c.DriverName
        FROM payments p
        JOIN parkingrecords pr ON p.RecordID = pr.RecordID
        JOIN cars c ON pr.PlateNumber = c.PlateNumber
    `;
    
    const params = [];
    
    if (date) {
        query += ' WHERE DATE(p.PaymentDate) = ?';
        params.push(date);
    }
    
    query += ' ORDER BY p.PaymentDate DESC';
    
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        
        const totalAmount = results.reduce((sum, payment) => sum + parseFloat(payment.AmountPaid), 0);
        
        res.json({
            date: date || 'All time',
            totalPayments: results.length,
            totalAmount: totalAmount,
            payments: results
        });
    });
};

// Generate Bill
exports.generateBill = (req, res) => {
    const { recordId } = req.params;
    
    const query = `
        SELECT pr.*, c.DriverName, c.PhoneNumber,
               p.AmountPaid, p.PaymentDate
        FROM parkingrecords pr
        JOIN cars c ON pr.PlateNumber = c.PlateNumber
        LEFT JOIN payments p ON pr.RecordID = p.RecordID
        WHERE pr.RecordID = ?
    `;
    
    db.query(query, [recordId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Record not found' });
        
        const record = results[0];
        const hours = Math.ceil(record.Duration / 60);
        const calculatedAmount = hours * 500;
        
        res.json({
            PlateNumber: record.PlateNumber,
            DriverName: record.DriverName,
            PhoneNumber: record.PhoneNumber,
            EntryTime: record.EntryTime,
            ExitTime: record.ExitTime,
            Duration: record.Duration,
            DurationHours: hours,
            AmountPaid: record.AmountPaid || calculatedAmount,
            PaymentDate: record.PaymentDate,
            RatePerHour: 500
        });
    });
};