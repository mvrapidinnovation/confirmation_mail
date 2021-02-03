const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// IMPORT ROUTES
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');

const logger = function(req, res, next) {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
}

dotenv.config();

// CONNECT TO DB
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.MONGO_URL, options, () => {
    console.log('Connected to DB!')
});

// Middlewares
app.use(logger);
app.use(express.json());

// ROUTES MIDDLEWARE
app.use('/api/user', authRoute);
app.use('/api/post', postRoute);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))