// Importing the Modules

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userRouter = require('../routes/userRoutes');
const crypto = require('crypto');

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please tell us your name!']
    },
    email : {
        type : String,
        required : [true, 'Please provide your email!'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, 'Please provide a valid email']
    },
    photo : String,
    role : {
        type : String,
        enum : ['user', 'guide', 'lead-guide', 'admin'],
        default : 'user'
    },
    password : {
        type : String,
        required : [true, 'Please provide a password'],
        minlength : 8,
        select : false
    },
    confirmPassword : {
        type : String,
        required : [true, 'Please confirm the password'],
        minlength : 8,
        validate : {
            // This only works on CREATE and SAVE
            validator : function(el) {
                return el === this.password;
            },
            message : 'Passwords are not the same!'
        }
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date
});

userSchema.pre('save', function(next) {
    // Only run this function if password was actually modified
    if(!this.isModified('password')) return next();

    // Hash the password with the cost of 12
    this.password = bcrypt.hash(this.password, 12);

    // Delete the passwordConfirm field
    this.confirmPassword = undefined;
    
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compose(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        console.log(changedTimeStamp, JWTTimestamp);
        return JWTTimestamp < changedTimeStamp;
    }

    // FALSE means password was not changed
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return this.passwordResetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;