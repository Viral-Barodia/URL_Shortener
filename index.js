const express = require('express');
const { connectToMongoDB } = require('./connect');
const path = require('path');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const URL = require('./models/url');
const app = express();
const PORT = 8000;

// Connection with MongoDB
connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
    .then(() => console.log("Database connected"))
    .catch(err => console.error('Database connection error:', err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/url", urlRoute);
app.use("/", staticRoute);

// Update click history
app.get('/url/:shortId', async (req,res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }
    );
    res.redirect(entry.redirectURL);
});
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
