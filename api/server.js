require('dotenv').config();
const express = require('express');
const { shortenUrl, getUrlCount, getOriginalUrl } = require('./controllers/apiController');
const { verifyToken } = require('./middleware/apiAuthMiddleware');

const app = express();
const port = process.env.API_PORT || 24402;

app.use(express.json());

app.post('/v1/shorten', verifyToken, shortenUrl);

app.get('/v1/count', verifyToken, getUrlCount);

app.get('/v1/:shortUrl', getOriginalUrl);

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});