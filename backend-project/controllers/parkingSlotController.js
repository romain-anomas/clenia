// backend-project/controllers/parkingSlotController.js
const db = require('../config/db');

// Create Parking Slot
exports.createSlot = (req, res) => {
    const { SlotNumber, SlotStatus } = req.body;

    db.query(
        'INSERT INTO parkingslots (SlotNumber, SlotStatus) VALUES (?, ?)',
        [SlotNumber, SlotStatus || 'Available'],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Slot number already exists' });
                }
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.status(201).json({ message: 'Parking slot created successfully' });
        }
    );
};

// Get All Slots
exports.getAllSlots = (req, res) => {
    db.query('SELECT * FROM parkingslots ORDER BY SlotNumber', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
};

// Get Available Slots
exports.getAvailableSlots = (req, res) => {
    db.query(
        "SELECT * FROM parkingslots WHERE SlotStatus = 'Available' ORDER BY SlotNumber",
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            res.json(results);
        }
    );
};

// Update Slot
exports.updateSlot = (req, res) => {
    const { slotNumber } = req.params;
    const { SlotStatus } = req.body;

    db.query(
        'UPDATE parkingslots SET SlotStatus = ? WHERE SlotNumber = ?',
        [SlotStatus, slotNumber],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Slot not found' });
            res.json({ message: 'Slot updated successfully' });
        }
    );
};

// Delete Slot
exports.deleteSlot = (req, res) => {
    const { slotNumber } = req.params;

    db.query('DELETE FROM parkingslots WHERE SlotNumber = ?', [slotNumber], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Slot not found' });
        res.json({ message: 'Slot deleted successfully' });
    });
};