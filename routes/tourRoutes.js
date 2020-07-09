// Importing the Modules

const express = require('express');
const tourController = require('./../controllers/tourController');

// Defining Routes

const tourRouter = express.Router();

tourRouter
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.postTour);

tourRouter
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.patchTour)
    .delete(tourController.deleteTour);

// Exporting the Modules

module.exports = tourRouter;