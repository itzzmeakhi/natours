// Importing the required libraries

const express = require('express');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

// Creating / Initializing an express app

const app = express();

// MIDDLEWARE's

// Defining Middleware

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
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
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.status = 'failed';
    err.statusCode = 404;

    next(err);
});

// Global Error Handling Middleware

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    res.status(err.statusCode).json({
        status : err.status,
        message : err.message
    });
});

// Exporting the Modules

module.exports = app;