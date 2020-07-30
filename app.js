// Importing the required libraries

const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const globalErrorHandler = require('./controllers/errorController');

// Creating / Initializing an express app

const app = express();

// GLOBAL MIDDLEWARE's

// Set security HTTP headers

app.use(helmet());

// Development Logging

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API

const limiter = rateLimit({
    max : 100,
    windowMs : 60 * 60 * 1000,
    message : 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body

app.use(express.json({ limit : '10kb' }));

// Data sanitization against NoSQL query injection

app.use(mongoSanitize());

// Data sanitization against XSS

app.use(xss());

// Serving the static files

app.use(express.static(`${__dirname}/public`));

// Test Middleware

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});

// ROUTES

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', postTour);
// app.patch('/api/v1/tours/:id', patchTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

app.use('*', (req, res, next) => {
    // res.status(404).json({
    //     status : 'failed',
    //     message : `Can't find ${req.originalUrl} on this server!`
    // });
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'failed';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware

app.use(globalErrorHandler);

// Exporting the Modules

module.exports = app;