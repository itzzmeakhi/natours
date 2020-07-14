// Importing the Modules

const Tour = require('./../models/tourModel');
const app = require('../app');
const { all } = require('../app');

// // Reading file synchronously at once

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));


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

// exports.checkBody = (req, res, next) => {
//     if(!req.body.name || !req.body.price) {
//         return res.status(404).json({
//             status : 'failed',
//             message : 'Name or Price data is missing.'
//         });
//     }
//     next();
// };


///////////////////////////

// ROUTE CALLBACK FUNCTIONS

//////////////////////////


// GET all available tours

exports.getAllTours = async (req, res) => {

    try {
        const allTours = await Tour.find();

        res.status(200).json({
            status : 'success',
            results : allTours.length,
            data : {
                tours : allTours
            }
        });
    } catch(error) {
        res.status(404).json({
            status : 'failed',
            message : error
        });
    }
};

// GET a specific tours using tourId

exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id);

        // ANOTHER WAY
        // const tour = Tour.findOne({ _id : req.params.id });

        res.status(200).json({
            status : 'success',
            data : {
                tour : tour
            }
        });
    } catch(error) {
        res.status(404).json({
            status : 'failed',
            message : error
        });
    }
};

// POST a new tour data object to the available tours list

exports.createTour = async (req, res) => {

    // Create Documents in MongoDB

    // const newTour = new Tour({});
    // newTour.save();

    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status : 'success',
            data : {
                tour : newTour
            }
        });
    } catch(error) {
        res.status(400).json({
            status : 'failed',
            message : error
        });
    }
};

// UPDATE a specific tour object using tourId

exports.updateTour = async (req, res) => {

    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        });

        res.status(200).json({
            status : 'success',
            data : {
                tour : updatedTour
            }
        });
    } catch(error) {
        res.status(400).json({
            status : 'failed',
            message : error
        });
    }
};

// DELETE a specific tour object using tourId

exports.deleteTour = (req, res) => {

    res.status(200).json({
        status : 'success',
    });
};