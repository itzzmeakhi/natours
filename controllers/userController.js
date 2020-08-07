// Importing the required Modules

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// ROUTE CALLBACK FUNCTIONS

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) {
            return newObj[el] = obj[el];
        }
    });
    return newObj;
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

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

// Update the user data

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create an Error if user POSTs password data

    if(req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please user /updatePassword',
                400
            )
        );
    }

    // 2) Filter out unwanted field names that are not allowed to be updated

    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user document

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new : true,
        runValidators : true
    });

    res.status(200).json({
        status : 'success',
        data : {
            user : updatedUser
        }
    });
});

// DELETE the user

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active : false });

    res.send(204).json({
        status : 'success',
        data : null
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

exports.deleteUser = factory.deleteOne(User);