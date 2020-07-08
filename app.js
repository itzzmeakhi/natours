// Importing the required libraries

const express = require('express');
const fs = require('fs');

// Creating / Initializing an express app

const app = express();
app.use(express.json());

// Defining Routes

// app.get('/', (req, res) => {
//     //res.status(200).send("Hi from the server!");
//     res.json({'message' : 'Hi from the server'});
// })

// Reading file synchronously at once

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

// Route to GET all available tours

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status : 'success',
        results : tours.length,
        data : {
            tours
        }
    });
});

// Route to GET a specific tour using tourId

app.get('/api/v1/tours/:id', (req, res) => {
    // console.log(req.params);

    const tourId = +req.params.id;
    const tour = tours.filter(tourElem => tourElem.id === tourId);
    // console.log(tour);

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
});

// Route to POST a tour to the available tours

app.post('/api/v1/tours', (req, res) => {
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
});

// Route to update a specific tour data using tourId and PATCH request

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

// Route to delete a specific tour data using tourId and DELETE request

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

// Listening on specific port

const port = 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}..!`);
});