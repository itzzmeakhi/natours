// Importing Modules

const mongoose = require('mongoose');
const User = require('./userModel');
const Review = require('./reviewModel');

// Tour Schema

const tourSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'A tour must have a name'],
        unique : true,
        trim : true,
        minlength : [40, 'A tour name must have minimum of 10 characters'],
        maxlength : [10, 'A tour name must have maximum of 40 characters']
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
        required : [true, 'A tour must have an difficulty'],
        enum : {
            values : ['easy', 'medium', 'difficult'],
            message : 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage : {
        type : Number,
        default : 4.5,
        min : [1, 'Rating must be above 1.0'],
        max : [5, 'Rating must be below 5.0'],
        set : val => Math.round(val * 10) / 10
    },
    ratingsQuantity : {
        type : Number,
        default : 0
    },
    price : {
        type : Number,
        required : [true, 'A tour must have a price']
    },
    priceDiscount : {
        type : Number,
        validate : {
            validator : function(val) {
                // Here this keyword points out to the current document
                return val < this.price;
            },
            message : 'Discount price {VALUE} should be below regular price'
        }
    },
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
        default : Date.now(),
        select : false
    },
    startDates : [Date],
    startLocation : {
        // GeoJSON
        type : {
            type : String,
            default : 'Point',
            enum : ['Point']
        },
        coordinates : [Number],
        address : String,
        description : String
    },
    locations : [
        {
            type : {
                type : String,
                default : 'Point',
                enum : ['Point']
            },
            coordinates : [Number],
            address : String,
            description : String,
            day : Number
        }
    ],
    guides : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'User'
        }
    ]
}, {
    toJSON : { virtuals : true },
    toObject : { virtuals : true }
});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

tourSchema.index({ price : 1, ratingsAverage : -1 });
tourSchema.index({ slug : 1 });
tourSchema.index({ startLocation : '2dsphere'});

// Virtual populate

tourSchema.virtual('reviews', {
    ref : Review,
    foreignField : 'tour',
    localField : '_id'
});

// DOCUMENT middleware. Runs only on Create and 

// tourSchema.pre('save', function(next) {
//     console.log("Will save the document");
//     next();
// });

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// });

// Query Middleware. Runs for all types of queries

// tourSchema.pre(/^find/, function(next) {
//     this.find({ secretTour : { $ne : true } });

//     this.start = Date.now();
//     next();
// });

// tourSchema.post(/^find/, function(docs, next) {
//     console.log(`Query took ${Date.now() - this.start} milliseconds`);
//     console.log(docs);
//     next();
// });

// Aggregation Middleware. Runs for all aggregation middleware's defined

tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match : { secretTour : { $ne : true } } });

    console.log(this.pipeline());
    next();
});

// Embedding tour guides data into tour data

// tourSchema.pre('save', async function(next) {
//     const guidePromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidePromises);
//     next();
// });

const Tour = mongoose.model('Tour', tourSchema);

// Exporting the Modules

module.exports= Tour;