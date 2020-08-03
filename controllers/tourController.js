// Importing the Modules

const Tour = require('./../models/tourModel');
const app = require('../app');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.getAllTours = catchAsync(async (req, res) => {

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
});

// GET a specific tours using tourId

exports.getTour = catchAsync(async (req, res) => {

    const tour = await Tour.findById(req.params.id).populate({
        path : 'guides',
        select : '-__v -passwordChangedAt'
    });

    // ANOTHER WAY
    // const tour = Tour.findOne({ _id : req.params.id });

    if(!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status : 'success',
        data : {
            tour : tour
        }
    });
});

// POST a new tour data object to the available tours list

exports.createTour = catchAsync(async (req, res) => {

    // Create Documents in MongoDB

    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status : 'success',
        data : {
            tour : newTour
        }
    });
});

// UPDATE a specific tour object using tourId

exports.updateTour = catchAsync(async (req, res) => {

    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    });

    if(!updatedTour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
        status : 'success',
        data : {
            tour : updatedTour
        }
    });
});

// DELETE a specific tour object using tourId

exports.deleteTour = catchAsync (async (req, res) => {
    
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if(tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(204).json({
        status : 'success',
    });

});

exports.getTourStats = catchAsync (async (req, res) => {

    const stats = await Tour.aggregate([
        {
            $match : { ratingsAverage : { $gte : 4.5 } }
        },
        {
            $group : {
                _id : { $toUpper : '$difficulty'} ,
                numTours : { $num : 1 },
                numRatings : { $sum : '$ratingsQuantity'},
                avgRating : { $avg : '$ratingsAverage' },
                avgPrice : { $avg : '$price' },
                minPrice : { $min : '$price' },
                maxPrice : { $max : '$price' }
            }
        },
        {
            $sort : { avgPrice : 1 }
        },
        {
            $match : { _id : { $ne : 'EASY' } }
        }
    ]);

    res.status(200).json({
        status : 'success',
        data : {
            stats : stats
        }
    });
}); 

exports.getMonthlyPlan = catchAsync(async (req, res) => {
    
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind : '$startDates'
        },
        {
            $match : {
                startDates : {
                    $gte : new Date(`${year}-01-01`),
                    $lte : new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group : {
                _id : { $month : '$startDates' },
                numTourStarts : { $sum : 1 },
                tours : { $push : '$name' }
            }
        },
        {
            $addFields : { month : '$_id' }
        },
        {
            $project : {
                _id : 0
            }
        },
        {
            $sort : { numTourStarts : -1 }
        }, 
        {
            $limit : 6
        }
    ]);
    res.status(200).json({
        status : 'success',
        data : {
            plan : plan
        }
    });
 
});