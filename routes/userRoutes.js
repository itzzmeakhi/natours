// Importing the Modules

const express = require('express');
const userController = require('./../controllers/userController');

// Defining Routes

const userRouter = express.Router();

userRouter
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.postUser)

userRouter
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

// Exporting the Modules

module.exports = userRouter;