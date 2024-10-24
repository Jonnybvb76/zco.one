const db = require('../db/db');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const sql = 'SELECT * FROM access_token WHERE token = ? AND expires_at > NOW()';
    db.query(sql, [token], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        next();  // Token is valid
    });
}

module.exports = { verifyToken };