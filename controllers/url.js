const shortid = require('shortid');
const URL = require('../models/url');

// Function to generate a shortened URL using shortid()
async function handleGenerateShortUrl(req,res) {
    const body = req.body;
    if(!body.url) {
        return res.status(402).json({ error: 'URL is required' });
    }
    const shortId = shortid();
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: []
    });

    return res.status(201).render('home', {
        id: shortId
    });
}

// Function to get analytics of visits for each URL
async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    try{
        const result = await URL.findOne({ shortId });
        if(result) {
            return res.status(200).json({
                totalClicks: result.visitHistory.length,
                analytics: result.visitHistory,
                message: 'Analytics fetched successfully!'
            });
        } else {
            return res.status(404).json({
                message: 'URL not found!'
            });
        }
    }
    catch(err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports = {
    handleGenerateShortUrl,
    handleGetAnalytics
}