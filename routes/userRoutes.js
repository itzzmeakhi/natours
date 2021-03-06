// Importing the Modules

const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// Defining Routes

const userRouter = express.Router();

userRouter.post('/signup', authController.signupNewUser);
userRouter.post('/login', authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.patch('/resetMyPassword', authController.protect, authController.updatePassword);

userRouter.get('/me', authController.protect, userController.getMe, userController.getUser);
userRouter.patch('/updateMe', authController.protect, userController.updateMe);
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);

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