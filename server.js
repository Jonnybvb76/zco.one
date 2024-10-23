const express = require('express');
const mysql = require('mysql2');
const dns = require('dns');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zcoone'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

function generateCustomId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    
    let result = '';
    
    for (let i = 0; i < 3; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    for (let i = 0; i < 3; i++) {
        result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    
    return result;
}

function isValidUrl(inputUrl) {
    try {
        const parsedUrl = new URL(inputUrl);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

function checkIfShortUrlExists(shortUrl) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS count FROM urls WHERE short_url = ?';
        db.query(sql, [shortUrl], (err, result) => {
            if (err) return reject(err);
            resolve(result[0].count > 0);
        });
    });
}

const shortenLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 10,  
    message: 'Zu viele Anfragen, bitte versuche es später erneut.'
});

app.get('/count', async (req, res) => {
    const sql = 'SELECT COUNT(*) AS urlCount FROM urls';
    db.query(sql, (err, result) => {
        if (err) throw err;
        return res.json({ count: result[0].urlCount });
    });
});

app.post('/shorten', shortenLimiter, async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl || !isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Ungültige oder fehlende URL' });
    }

    const parsedUrl = new URL(originalUrl);
    dns.lookup(parsedUrl.hostname, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'URL-Domain nicht erreichbar' });
        }

        let shortUrl;
        do {
            shortUrl = generateCustomId();
        } while (await checkIfShortUrlExists(shortUrl));

        const sql = 'INSERT INTO urls (original_url, short_url, click_count) VALUES (?, ?, 0)';
        db.query(sql, [originalUrl, shortUrl], (err, result) => {
            if (err) throw err;
            return res.json({ shortUrl });
        });
    });
});

app.get('/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;

    const sql = 'SELECT original_url, click_count FROM urls WHERE short_url = ?';
    db.query(sql, [shortUrl], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const originalUrl = result[0].original_url;
            const clickCount = result[0].click_count;

            const updateSql = 'UPDATE urls SET click_count = ? WHERE short_url = ?';
            db.query(updateSql, [clickCount + 1, shortUrl], (err) => {
                if (err) throw err;

                res.redirect(originalUrl);
            });
        } else {
            res.status(404).json({ error: 'Kurze URL nicht gefunden' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});