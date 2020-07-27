// Importing the Modules

const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// Defining Routes

const userRouter = express.Router();

userRouter.post('/signup', authController.signupNewUser);
userRouter.post('/login', authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.post('/resetPassword', authController.resetPassword);

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