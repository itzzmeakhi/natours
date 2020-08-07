// Importing the Modules

const express = require('express');
const reviewRoutes = require('./reviewRoutes');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

// Defining Routes

const tourRouter = express.Router();

// Paramter Middleware

// tourRouter
//     .param('id', tourController.checkID);

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/94887fda

tourRouter
    .use('/:tourId/reviews', reviewRoutes);

tourRouter
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

// /tours-distance?distance=233&center=-40,45&unit=mi
// /tours-distance/233/center/-40,45/unit/mi

tourRouter
    .route('/tours-within/:distance/center/:latlng/unit/:unit', tourController.getToursWithin)

tourRouter
    .route('/distances/:latlng/unit/:unit')
    .get(tourController.getDistances)

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// Exporting the Modules

module.exports = tourRouter;