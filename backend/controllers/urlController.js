const axios = require('axios');

const apiUrl = process.env.API_URL || 'http://localhost:3002/api';
const apiToken = process.env.API_TOKEN;

async function shortenUrl(req, res) {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await axios.post(`${apiUrl}/shorten`, { originalUrl }, {
            headers: { 'Authorization': `Bearer ${apiToken}` }
        });

        res.json({ shortUrl: response.data.shortUrl });
    } catch (error) {
        console.error('Error contacting API:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error communicating with API' });
    }
}

async function getUrlCount(req, res) {
    try {
        const response = await axios.get(`${apiUrl}/count`, {
            headers: { 'Authorization': `Bearer ${apiToken}` }
        });

        res.json({ count: response.data.count });
    } catch (error) {
        console.error('Error fetching URL count:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error communicating with API' });
    }
}

async function redirectShortUrl(req, res) {
    const { shortUrl } = req.params;

    try {
        const response = await axios.get(`${apiUrl}/${shortUrl}`);

        if (response.data.originalUrl) {
            res.redirect(response.data.originalUrl);
        } else {
            res.status(404).json({ error: 'Short URL not found' });
        }
    } catch (error) {
        console.error('Error fetching short URL:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error communicating with API' });
    }
}

module.exports = { shortenUrl, getUrlCount, redirectShortUrl };