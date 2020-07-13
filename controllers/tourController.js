// Importing the Modules

const Tour = require('./../models/tourModel');

// // Reading file synchronously at once

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));

///////////////////////////

// ROUTE CALLBACK FUNCTIONS

//////////////////////////

// Utility function to check the validity of ID

// exports.checkID = (req, res, next, val) => {
//     const tourId = +req.params.id;
//     const tour = tours.filter(tourElem => tourElem.id === tourId);

//     if(tour.length === 0) {
//         return res.status(404).json({
//             status : 'failed',
//             message : 'Invalid Id'
//         });
//     }
//     next();
// };

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
    });
};

// GET a specific tours using tourId

exports.getTour = (req, res) => {

    res.status(200).json({
        status : 'success',
    });
};

// POST a new tour data object to the available tours list

exports.postTour = (req, res) => {

    res.status(201).json({
        status : 'success',
    });
};

// PATCH a specific tour object using tourId

exports.patchTour = (req, res) => {

    res.status(200).json({
        status : 'success',
    });
};

// DELETE a specific tour object using tourId

exports.deleteTour = (req, res) => {

    res.status(204).json({
        status : 'success',
    });
};