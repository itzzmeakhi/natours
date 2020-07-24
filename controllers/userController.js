// Importing the required Modules

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

// ROUTE CALLBACK FUNCTIONS

// GET all available users

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status : 'success',
        results : users.length,
        data : {
            users : users
        }
    });
});

// POST a new user

exports.postUser = (req, res) => {
    res.status(500).json({
        status : 'error',
        message : 'This route is not defined.'
    });
};

// GET an specific user using userId

exports.getUser = (req, res) => {
    res.status(500).json({
        status : 'error',
        message : 'This route is not defined.'
    });
};

// PATCH an specific user data using userId

exports.updateUser = (req, res) => {
    res.status(500).json({
        status : 'error',
        message : 'This route is not defined.'
    });
};

// DELETE an specific user using userId

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status : 'error',
        message : 'This route is not defined.'
    });
};