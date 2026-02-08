// backend-project/controllers/parkingRecordController.js
const db = require('../config/db');

// Create Entry (Check-in)
exports.createEntry = (req, res) => {
    const { PlateNumber, SlotNumber, EntryTime } = req.body;

    // Check if slot is available
    db.query(
        "SELECT SlotStatus FROM parkingslots WHERE SlotNumber = ?",
        [SlotNumber],
        (err, slotResults) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            if (slotResults.length === 0) return res.status(404).json({ message: 'Slot not found' });
            if (slotResults[0].SlotStatus !== 'Available') {
                return res.status(400).json({ message: 'Slot is not available' });
            }

            // Create record and update slot status
            db.query(
                'INSERT INTO parkingrecords (PlateNumber, SlotNumber, EntryTime) VALUES (?, ?, ?)',
                [PlateNumber, SlotNumber, EntryTime],
                (err, result) => {
                    if (err) return res.status(500).json({ message: 'Database error', error: err });
                    
                    // Update slot status to Occupied
                    db.query(
                        "UPDATE parkingslots SET SlotStatus = 'Occupied' WHERE SlotNumber = ?",
                        [SlotNumber],
                        (err) => {
                            if (err) console.error('Error updating slot status:', err);
                        }
                    );
                    
                    res.status(201).json({ 
                        message: 'Entry recorded successfully',
                        recordId: result.insertId 
                    });
                }
            );
        }
    );
};

// Update Exit (Check-out)
exports.updateExit = (req, res) => {
    const { recordId } = req.params;
    const { ExitTime } = req.body;

    db.query(
        'SELECT EntryTime FROM parkingrecords WHERE RecordID = ?',
        [recordId],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            if (results.length === 0) return res.status(404).json({ message: 'Record not found' });

            const entryTime = new Date(results[0].EntryTime);
            const exitTime = new Date(ExitTime);
            
            // Calculate duration in minutes
            const durationMs = exitTime - entryTime;
            const durationMinutes = Math.ceil(durationMs / (1000 * 60));
            
            // Calculate hours (round up to nearest hour for billing)
            const hours = Math.ceil(durationMinutes / 60);
            const amount = hours * 500; // 500 RWF per hour

            db.query(
                'UPDATE parkingrecords SET ExitTime = ?, Duration = ? WHERE RecordID = ?',
                [ExitTime, durationMinutes, recordId],
                (err, result) => {
                    if (err) return res.status(500).json({ message: 'Database error', error: err });
                    
                    // Free up the slot
                    db.query(
                        `UPDATE parkingslots ps 
                         JOIN parkingrecords pr ON ps.SlotNumber = pr.SlotNumber 
                         SET ps.SlotStatus = 'Available' 
                         WHERE pr.RecordID = ?`,
                        [recordId],
                        (err) => {
                            if (err) console.error('Error updating slot status:', err);
                        }
                    );

                    res.json({ 
                        message: 'Exit recorded successfully',
                        duration: durationMinutes,
                        hours: hours,
                        amount: amount
                    });
                }
            );
        }
    );
};

// Get All Records
exports.getAllRecords = (req, res) => {
    const query = `
        SELECT pr.*, c.DriverName, c.PhoneNumber, ps.SlotStatus
        FROM parkingrecords pr
        JOIN cars c ON pr.PlateNumber = c.PlateNumber
        JOIN parkingslots ps ON pr.SlotNumber = ps.SlotNumber
        ORDER BY pr.EntryTime DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
};

// Get Record by ID
exports.getRecordById = (req, res) => {
    const { recordId } = req.params;
    
    const query = `
        SELECT pr.*, c.DriverName, c.PhoneNumber
        FROM parkingrecords pr
        JOIN cars c ON pr.PlateNumber = c.PlateNumber
        WHERE pr.RecordID = ?
    `;
    
    db.query(query, [recordId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Record not found' });
        res.json(results[0]);
    });
};

// Delete Record
exports.deleteRecord = (req, res) => {
    const { recordId } = req.params;

    db.query('DELETE FROM parkingrecords WHERE RecordID = ?', [recordId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Record deleted successfully' });
    });
};

// Get Active Records (cars currently parked)
exports.getActiveRecords = (req, res) => {
    const query = `
        SELECT pr.*, c.DriverName, c.PhoneNumber
        FROM parkingrecords pr
        JOIN cars c ON pr.PlateNumber = c.PlateNumber
        WHERE pr.ExitTime IS NULL
        ORDER BY pr.EntryTime DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
};