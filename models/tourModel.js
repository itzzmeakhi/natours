// Importing Modules

const mongoose = require('mongoose');

// Tour Schema

const tourSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'A tour must have a name'],
        unique : true,
        trim : true
    },
    duration : {
        type : Number,
        required : [true, 'A tour must have a duration']
    },
    maxGroupSize : {
        type : Number,
        required : [true, 'A tour must have a max group size limit']
    },
    difficulty : {
        type : String,
        required : [true, 'A tour must have an difficulty']
    },
    ratingsAverage : {
        type : Number,
        default : 4.5
    },
    ratingsQuantity : {
        type : Number,
        default : 0
    },
    price : {
        type : Number,
        required : [true, 'A tour must have a price']
    },
    priceDiscount : Number,
    summary : {
        type : String,
        trim : true,
        required : [true, 'A tour must have an summary']
    },
    description : {
        type : String,
        trim : true
    },
    imageCover : {
        type : String,
        required : [true, 'A tour must have an cover image']
    },
    images : [String],
    createdAt : {
        type : Date,
        default : Date.now()
    },
    startDates : [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

// Exporting the Modules

module.exports= Tour;