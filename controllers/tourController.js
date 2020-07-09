// Importing the Modules

const fs = require('fs');

// ROUTE CALLBACK FUNCTIONS

// Reading file synchronously at once

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));

// Utility function to check the validity of ID

exports.checkID = (req, res, next, val) => {
    const tourId = +req.params.id;
    const tour = tours.filter(tourElem => tourElem.id === tourId);

    if(tour.length === 0) {
        return res.status(404).json({
            status : 'failed',
            message : 'Invalid Id'
        });
    }
    next();
};

// Utility function to check the validity of body data passed

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(404).json({
            status : 'failed',
            message : 'Name or Price data is missing.'
        });
    }
    next();
};

// GET all available tours

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status : 'success',
        results : tours.length,
        data : {
            tours
        }
    });
};

// GET a specific tours using tourId

exports.getTour = (req, res) => {

    const tourId = +req.params.id;
    const tour = tours.filter(tourElem => tourElem.id === tourId);

    res.status(200).json({
        status : 'success',
        results : tour.length,
        data : {
            tour : tour
        }
    });
};

// POST a new tour data object to the available tours list

exports.postTour = (req, res) => {
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

exports.patchTour = (req, res) => {
    const tourId = +req.params.id;
    const tour = tours.filter(tourElem => tourElem.id === tourId);

    res.status(200).json({
        status : 'success',
        data : {
            tour : '<Tour Data of Id: .... is updated! />'
        }
    });
};

// DELETE a specific tour object using tourId

exports.deleteTour = (req, res) => {
    const tourId = +req.params.id;
    const tour = tours.filter(tourElem => tourElem.id === tourId);

    res.status(204).json({
        status : 'success',
        data : null
    });
};