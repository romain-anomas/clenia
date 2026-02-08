const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_secret_key_here';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL password if you have one
    database: 'PSSMS'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL Connection Error:', err);
        return;
    }
    console.log('Connected to MySQL database');
    
    // Create database and tables if they don't exist
    initializeDatabase();
});

function initializeDatabase() {
    // Create database if not exists
    db.query('CREATE DATABASE IF NOT EXISTS PSSMS', (err) => {
        if (err) console.error('Error creating database:', err);
        else {
            console.log('Database PSSMS ensured');
            // Use database
            db.query('USE PSSMS', (err) => {
                if (err) console.error('Error using database:', err);
                else createTables();
            });
        }
    });
}

function createTables() {
    // Users table
    db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ParkingSlot table
    db.query(`
        CREATE TABLE IF NOT EXISTS parkingslots (
            SlotNumber VARCHAR(20) PRIMARY KEY,
            SlotStatus ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available'
        )
    `);

    // Car table
    db.query(`
        CREATE TABLE IF NOT EXISTS cars (
            PlateNumber VARCHAR(20) PRIMARY KEY,
            DriverName VARCHAR(100) NOT NULL,
            PhoneNumber VARCHAR(20) NOT NULL
        )
    `);

    // ParkingRecord table
    db.query(`
        CREATE TABLE IF NOT EXISTS parkingrecords (
            RecordID INT AUTO_INCREMENT PRIMARY KEY,
            PlateNumber VARCHAR(20) NOT NULL,
            SlotNumber VARCHAR(20) NOT NULL,
            EntryTime DATETIME NOT NULL,
            ExitTime DATETIME,
            Duration INT,
            FOREIGN KEY (PlateNumber) REFERENCES cars(PlateNumber) ON DELETE CASCADE,
            FOREIGN KEY (SlotNumber) REFERENCES parkingslots(SlotNumber) ON DELETE CASCADE
        )
    `);

    // Payment table
    db.query(`
        CREATE TABLE IF NOT EXISTS payments (
            PaymentID INT AUTO_INCREMENT PRIMARY KEY,
            RecordID INT NOT NULL,
            AmountPaid DECIMAL(10, 2) NOT NULL,
            PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (RecordID) REFERENCES parkingrecords(RecordID) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) console.error('Error creating tables:', err);
        else console.log('All tables ensured');
    });

    // Insert default admin user
    const defaultPassword = bcrypt.hashSync('Admin@123', 10);
    db.query(`
        INSERT IGNORE INTO users (username, password) VALUES ('admin', ?)
    `, [defaultPassword]);
}

// AUTH ROUTES
// Register
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    
    // Strong password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character' 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ message: 'Username already exists' });
                    }
                    return res.status(500).json({ message: 'Database error', error: err });
                }
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
            res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username } });
        }
    );
});

// CAR ROUTES
app.post('/api/cars', (req, res) => {
    const { PlateNumber, DriverName, PhoneNumber } = req.body;
    db.query(
        'INSERT INTO cars (PlateNumber, DriverName, PhoneNumber) VALUES (?, ?, ?)',
        [PlateNumber, DriverName, PhoneNumber],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Plate number already exists' });
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.status(201).json({ message: 'Car registered successfully' });
        }
    );
});

app.get('/api/cars', (req, res) => {
    db.query('SELECT * FROM cars ORDER BY PlateNumber', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});

app.put('/api/cars/:plateNumber', (req, res) => {
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
});

app.delete('/api/cars/:plateNumber', (req, res) => {
    const { plateNumber } = req.params;
    db.query('DELETE FROM cars WHERE PlateNumber = ?', [plateNumber], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Car not found' });
        res.json({ message: 'Car deleted successfully' });
    });
});

// PARKING SLOT ROUTES
app.post('/api/parking-slots', (req, res) => {
    const { SlotNumber, SlotStatus } = req.body;
    db.query(
        'INSERT INTO parkingslots (SlotNumber, SlotStatus) VALUES (?, ?)',
        [SlotNumber, SlotStatus || 'Available'],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Slot number already exists' });
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.status(201).json({ message: 'Parking slot created successfully' });
        }
    );
});

app.get('/api/parking-slots', (req, res) => {
    db.query('SELECT * FROM parkingslots ORDER BY SlotNumber', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});

app.get('/api/parking-slots/available', (req, res) => {
    db.query("SELECT * FROM parkingslots WHERE SlotStatus = 'Available' ORDER BY SlotNumber", (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});

app.put('/api/parking-slots/:slotNumber', (req, res) => {
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
});

app.delete('/api/parking-slots/:slotNumber', (req, res) => {
    const { slotNumber } = req.params;
    db.query('DELETE FROM parkingslots WHERE SlotNumber = ?', [slotNumber], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Slot not found' });
        res.json({ message: 'Slot deleted successfully' });
    });
});

// PARKING RECORD ROUTES
app.post('/api/parking-records/entry', (req, res) => {
    const { PlateNumber, SlotNumber, EntryTime } = req.body;
    
    db.query("SELECT SlotStatus FROM parkingslots WHERE SlotNumber = ?", [SlotNumber], (err, slotResults) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (slotResults.length === 0) return res.status(404).json({ message: 'Slot not found' });
        if (slotResults[0].SlotStatus !== 'Available') return res.status(400).json({ message: 'Slot is not available' });

        db.query(
            'INSERT INTO parkingrecords (PlateNumber, SlotNumber, EntryTime) VALUES (?, ?, ?)',
            [PlateNumber, SlotNumber, EntryTime],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error', error: err });
                
                db.query("UPDATE parkingslots SET SlotStatus = 'Occupied' WHERE SlotNumber = ?", [SlotNumber]);
                res.status(201).json({ message: 'Entry recorded successfully', recordId: result.insertId });
            }
        );
    });
});

app.put('/api/parking-records/exit/:recordId', (req, res) => {
    const { recordId } = req.params;
    const { ExitTime } = req.body;

    db.query('SELECT EntryTime FROM parkingrecords WHERE RecordID = ?', [recordId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Record not found' });

        const entryTime = new Date(results[0].EntryTime);
        const exitTime = new Date(ExitTime);
        const durationMs = exitTime - entryTime;
        const durationMinutes = Math.ceil(durationMs / (1000 * 60));
        const hours = Math.ceil(durationMinutes / 60);
        const amount = hours * 500;

        db.query(
            'UPDATE parkingrecords SET ExitTime = ?, Duration = ? WHERE RecordID = ?',
            [ExitTime, durationMinutes, recordId],
            (err, result) => {
                if (err) return res.status(500).json({ message: 'Database error', error: err });
                
                db.query(
                    `UPDATE parkingslots ps JOIN parkingrecords pr ON ps.SlotNumber = pr.SlotNumber SET ps.SlotStatus = 'Available' WHERE pr.RecordID = ?`,
                    [recordId]
                );

                res.json({ message: 'Exit recorded successfully', duration: durationMinutes, hours, amount });
            }
        );
    });
});

app.get('/api/parking-records', (req, res) => {
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
});

app.get('/api/parking-records/active', (req, res) => {
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
});

app.get('/api/parking-records/:recordId', (req, res) => {
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
});

app.delete('/api/parking-records/:recordId', (req, res) => {
    const { recordId } = req.params;
    db.query('DELETE FROM parkingrecords WHERE RecordID = ?', [recordId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Record deleted successfully' });
    });
});

// PAYMENT ROUTES
app.post('/api/payments', (req, res) => {
    const { RecordID, AmountPaid, PaymentDate } = req.body;
    db.query(
        'INSERT INTO payments (RecordID, AmountPaid, PaymentDate) VALUES (?, ?, ?)',
        [RecordID, AmountPaid, PaymentDate],
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            res.status(201).json({ message: 'Payment recorded successfully', paymentId: result.insertId });
        }
    );
});

app.get('/api/payments', (req, res) => {
    const query = `
        SELECT p.*, pr.PlateNumber, pr.EntryTime, pr.ExitTime, pr.Duration, c.DriverName, c.PhoneNumber
        FROM payments p
        JOIN parkingrecords pr ON p.RecordID = pr.RecordID
        JOIN cars c ON pr.PlateNumber = c.PlateNumber
        ORDER BY p.PaymentDate DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});

app.get('/api/payments/daily-report', (req, res) => {
    const { date } = req.query;
    let query = `
        SELECT p.*, pr.PlateNumber, pr.EntryTime, pr.ExitTime, pr.Duration, c.DriverName
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
        res.json({ date: date || 'All time', totalPayments: results.length, totalAmount, payments: results });
    });
});

app.get('/api/payments/bill/:recordId', (req, res) => {
    const { recordId } = req.params;
    const query = `
        SELECT pr.*, c.DriverName, c.PhoneNumber, p.AmountPaid, p.PaymentDate
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
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});