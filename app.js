const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const secrets = require('./util/secrets');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

const MONGODB_URI = `mongodb+srv://${secrets.mongoDbUser}:${secrets.mongoDbPassword}@cluster0-f8kmd.gcp.mongodb.net/messages`;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() => {
        app.listen(8080);
    })
    .catch(err => console.log(err));

