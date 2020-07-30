// Importing the required libraries

const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Creating / Initializing an express app

const app = express();

// GLOBAL MIDDLEWARE's

// Defining Middleware

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max : 100,
    windowMs : 60 * 60 * 1000,
    message : 'Too many requests from this IP, please try again in an hour'
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));


// app.use((req, res, next) => {
//     console.log("Hello from the Middleware 😁");
//     next();
// });

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