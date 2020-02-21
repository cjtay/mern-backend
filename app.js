const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

// error handling for unsupported routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

// error handling middleware - this is creating the error middleware function //
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({
        message: error.message || 'An unknown system error has occured'
    });
});

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-zziow.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });
