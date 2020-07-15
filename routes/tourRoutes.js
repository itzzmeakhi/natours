// Importing the Modules

const express = require('express');
const tourController = require('./../controllers/tourController');

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
    .get(tourController.getAllTours)
    .post(tourController.createTour);

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

// Exporting the Modules

module.exports = tourRouter;