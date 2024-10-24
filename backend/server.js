require('dotenv').config();
const express = require('express');
const { shortenUrl, getUrlCount, redirectShortUrl } = require('./controllers/urlController');

const app = express();
const port = process.env.BACKEND_PORT || 24401;

app.use(express.json());
app.use(express.static('../frontend/public'));

app.post('/shorten', shortenUrl);

app.get('/count', getUrlCount);

app.get('/:shortUrl', redirectShortUrl);

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});