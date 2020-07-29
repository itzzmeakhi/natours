// Importing the required modules

const User = require('./../models/userModel');
const crypto = require('crypto');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const cookieOptions = {
    expires : new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly : true
};

if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

const signInToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN
    });
};

// Send Token Response

const createSendToken = (user, statusCode, res) => {
    const token = signInToken(user._id);

    res.cookie('jwt', token, cookieOptions);

    // Remove the password in the ressult output

    user.password = undefined;

    res.status(statusCode).json({
        status : 'success',
        token,
        data : {
            user: user
        }
    });
};

// Controller function to handle signing up of new user

exports.signupNewUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm
    });

    createSendToken(newUser, 201, res);

    // const token = signInToken(newUser._id);

    // res.status(201).json({
    //     status : 'success',
    //     data : {
    //         user : newUser
    //     }
    // });
});

// Controller function to handle login of a user

exports.login = catchAsync(async (req, res, next) => {

    // EMAIL AND PASSWORD

    const { email, password } = req.body;

    // 1) CHECK IF EMAIL AND PASSWORD

    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2) CHECK IF USER EXISTS AND PASSWORD IS CORRECT

    const user = await User.findOne({ email : email }).select('+password');

    if(!user || !(user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) IF EVERYTHING IS OK, SEND RESPONSE TO THE CLIENT

    createSendToken(user, 200, res);

    // const token = signInToken(user._id);
    // res.status(200).json({
    //     status : 'success',
    //     token : token
    // });
});

// Controller function to protect the routes based on the authentication status

exports.protect = catchAsync(async (req, res, next) => {

    // 1) Getting token and check if it is there

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists

    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist', 401));
    }

    // 4) Check if user changed password after the token was issued

    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed the password. Please login again.', 401));
    }

    req.user = currentUser;
    next();
});

// Controller function to handle accesss to specific routes based on user roles

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action.', 403)
            );
        }

        next();
    };
};

// Controller function to handle forgot password

exports.forgotPassword = async (req, res, next) => {
    // 1) Get user based on POSTed email

    const user = await User.findOne({ email : req.body.email });

    if(!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave : false });

    // 3) Send that reset token to the user's mail

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm
    to ${resetURL}. \n If you didn't forget your password, please ignore this email!`;

    try {
    
        await sendEmail({
            email : user.email,
            subject : 'Your password reset token (Valid for 10 min)',
            message
        });

        res.status(200).json({
            status : 'success',
            message : 'Token sent to email!'
        });
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave : false });

        return next(new AppError('There was an error sending an mail. Try again later', 500));
    }
};

// Controller function to reset password

exports.resetPassword = (req, res, next) => {
    // 1) GET the user based on the token

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken : hashedToken, passwordResetExpires : { $gt : Date.now() } });

    // 2) If the token has not expired, and there is user, set the password

    if(!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user

    // 4) Log the user in, send the JWT

    createSendToken(user, 200, res);

    // const token = signInToken(user._id);

    // res.status(200).json({
    //     status : 'success',
    //     token
    // });
};

// Controller function to update the password

exports.updatePassword = catchAsync(async (req, res, next) => {

    // 1) GET user from the collection

    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct

    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong!', 401));
    }

    // 3) If so, update the password

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Log user in, send JWT

    createSendToken(user, 200, res);
});