require('dotenv').config();
const express = require('express');
const { shortenUrl, getUrlCount, getOriginalUrl } = require('./controllers/apiController');
const { verifyToken } = require('./middleware/apiAuthMiddleware');

const app = express();
const port = process.env.API_PORT || 24402;

app.use(express.json());

app.post('/api/shorten', verifyToken, shortenUrl);

app.get('/api/count', verifyToken, getUrlCount);

app.get('/api/:shortUrl', getOriginalUrl);

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});