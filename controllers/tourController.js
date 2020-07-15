// Importing the Modules

const Tour = require('./../models/tourModel');
const app = require('../app');
const APIFeatures = require('./../utils/apiFeatures');

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

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage, price';
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
    next();
};


// GET all available tours

exports.getAllTours = async (req, res) => {

    try {

        // console.log(req.query);
        // const allTours = await Tour.find().where('duration').equals(5);

        // BUILD QUERY

        // FILTERING QUERY

        // console.log(req.query);

        // const queryObj = { ...req.query };
        // const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // excludedFields.forEach(el => delete queryObj[el]);

        // ADVANCED FILTERING

        // let queryStr = JSON.stringify(queryObj);
        // queryStr = JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`));

        // const query = Tour.find(queryStr);

        // SORTING THE RESULTS
        // DEFAULT SORTING (ASCENDING), FOR DESCENDING SORTING (-)

        // if(req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy);
        // } else {
        //     query = query.sort('createdAt');
        // }

        // http://localhost:8000/api/v1/tours?price=121&rating[gte]=4.7&sort=price

        // FIELD LIMITING

        // if(req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);
        // } else {
        //     query = query.select('__v');
        // }

        // PAGINATION

        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit;

        // query = query.skip(skip).limit(limit);

        // if(req.query.page) {
        //     const numTours = await Tour.countDocuments();
        //     if (skip >= numTours) throw new Error('This page does not exist');
        // }

        // EXECUTE QUERY

        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();

        const allTours = await features.query;

        // SEND RESPONSE

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

exports.deleteTour = async (req, res) => {

    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status : 'success',
        });
    } catch(error) {
        res.status(404).json({
            status : 'failed',
            message : error
        });
    }
};