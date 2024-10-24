const { generateCustomId, isValidUrl } = require('../utils/helpers');
const mysql = require('../db/db');

async function shortenUrl(req, res) {
    const { originalUrl } = req.body;

    if (!originalUrl || !isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    const shortUrl = generateCustomId();

    const sql = 'INSERT INTO urls (original_url, short_url) VALUES (?, ?)';
    mysql.query(sql, [originalUrl, shortUrl], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ shortUrl });
    });
}

async function getUrlCount(req, res) {
    const sql = 'SELECT COUNT(*) AS urlCount FROM urls';
    
    mysql.query(sql, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ count: result[0].urlCount });
    });
}

async function getOriginalUrl(req, res) {
    const { shortUrl } = req.params;

    const sql = 'SELECT original_url, click_count FROM urls WHERE short_url = ?';
    mysql.query(sql, [shortUrl], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length > 0) {
            const originalUrl = result[0].original_url;
            const clickCount = result[0].click_count;

            const updateSql = 'UPDATE urls SET click_count = ? WHERE short_url = ?';
            mysql.query(updateSql, [clickCount + 1, shortUrl], (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Error updating click count' });
                }
                res.json({ originalUrl });
            });
        } else {
            res.status(404).json({ error: 'Short URL not found' });
        }
    });
}

module.exports = { shortenUrl, getUrlCount, getOriginalUrl };