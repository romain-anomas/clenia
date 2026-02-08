// backend-project/controllers/carController.js
const db = require('../config/db');

// Create Car
exports.createCar = (req, res) => {
    const { PlateNumber, DriverName, PhoneNumber } = req.body;

    db.query(
        'INSERT INTO cars (PlateNumber, DriverName, PhoneNumber) VALUES (?, ?, ?)',
        [PlateNumber, DriverName, PhoneNumber],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Plate number already exists' });
                }
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.status(201).json({ message: 'Car registered successfully' });
        }
    );
};

// Get All Cars
exports.getAllCars = (req, res) => {
    db.query('SELECT * FROM cars ORDER BY PlateNumber', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
};

// Get Car by PlateNumber
exports.getCarByPlate = (req, res) => {
    const { plateNumber } = req.params;
    
    db.query('SELECT * FROM cars WHERE PlateNumber = ?', [plateNumber], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Car not found' });
        res.json(results[0]);
    });
};

// Update Car
exports.updateCar = (req, res) => {
    const { plateNumber } = req.params;
    const { DriverName, PhoneNumber } = req.body;

    db.query(
        'UPDATE cars SET DriverName = ?, PhoneNumber = ? WHERE PlateNumber = ?',
        [DriverName, PhoneNumber, plateNumber],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Car not found' });
            res.json({ message: 'Car updated successfully' });
        }
    );
};

// Delete Car
exports.deleteCar = (req, res) => {
    const { plateNumber } = req.params;

    db.query('DELETE FROM cars WHERE PlateNumber = ?', [plateNumber], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Car not found' });
        res.json({ message: 'Car deleted successfully' });
    });
};