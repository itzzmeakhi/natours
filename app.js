// Importing the required libraries

const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

// Creating / Initializing an express app

const app = express();

// MIDDLEWARE's

// Defining Middleware

app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    console.log("Hello from the Middleware 😁");
    next();
});

// ROUTE CALLBACK FUNCTIONS

// Reading file synchronously at once

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

// GET all available tours

const getAllTours = (req, res) => {
    res.status(200).json({
        status : 'success',
        results : tours.length,
        data : {
            tours
        }
    });
};

// GET a specific tours based on tourId

const getTour = (req, res) => {

    const tourId = +req.params.id;
    const tour = tours.filter(tourElem => tourElem.id === tourId);

    if(!tour) {
        res.status(404).json({
            status : 'failed',
            message : 'Invalid Id'
        });
    }

    res.status(200).json({
        status : 'success',
        results : tour.length,
        data : {
            tour : tour
        }
    });
};

// POST a new tour data object to the available tours list

const postTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id : newId }, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, tours, err => {
        res.status(201).json({
            status : 'success',
            data : {
                tour : newTour
            }
        });
    });
};

// PATCH a specific tour object using tourId

const patchTour = (req, res) => {
    const tourId = +req.params.id;
    const tour = tours.filter(tourElem => tourElem.id === tourId);

    if(!tour) {
        res.status(404).json({
            status : 'failed',
            message : 'Invalid Id'
        });
    }

    res.status(200).json({
        status : 'success',
        data : {
            tour : '<Tour Data of Id: .... is updated! />'
        }
    });
};

// DELETE a specific tour object using tourId

const deleteTour = (req, res) => {
    const tourId = +req.params.id;
    const tour = tours.filter(tourElem => tourElem.id === tourId);

    if(!tour) {
        res.status(404).json({
            status : 'failed',
            message : 'Invalid Id'
        });
    }

    res.status(204).json({
        status : 'success',
        data : null
    });
};

// ROUTES

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', postTour);
// app.patch('/api/v1/tours/:id', patchTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(postTour);
app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(patchTour)
    .delete(deleteTour);

app
    .route('/api/v1/users')
    .get(getAllUsers)
    .post(postUser)

// SERVER

// Listening on specific port

const port = 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}..!`);
});