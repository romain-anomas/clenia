// backend-project/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = 'your_secret_key_here';

// Register
exports.register = async (req, res) => {
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
};

// Login
exports.login = (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            
            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
                expiresIn: '8h'
            });

            res.json({ 
                message: 'Login successful', 
                token,
                user: { id: user.id, username: user.username }
            });
        }
    );
};