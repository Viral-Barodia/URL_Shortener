const express = require('express');
const router = express.Router();
const { handleGenerateShortUrl, handleGetAnalytics } = require('../controllers/url');

// Route to shorten the URL
router.post("/", handleGenerateShortUrl);

// Route to get analytics for a particular URL
router.get("/analytics/:shortId", handleGetAnalytics);
module.exports = router;