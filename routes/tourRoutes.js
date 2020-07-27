// Importing the Modules

const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

// Defining Routes

const tourRouter = express.Router();

// Paramter Middleware

// tourRouter
//     .param('id', tourController.checkID);

tourRouter
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour);

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// Exporting the Modules

module.exports = tourRouter;