// Importing the Modules

const dotenv = require('dotenv');
const mongoose = require('mongoose');

// SET Environment Variables

dotenv.config({ path : './config.env' });

const app = require('./app');

// console.log(process.env);

// Connection to MongoDB

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(con => {
    console.log("DB connected successfully");
})

// Tour Schema

const tourSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'A tour must have a name'],
        unique : true
    },
    rating : {
        type : Number,
        default : 4.5
    },
    price : {
        type : Number,
        required : [true, 'A tour must have a price']
    }
});

const Tour = mongoose.model('Tour', tourSchema);


const testTour = new Tour({
    name : 'The Forest Killer',
    rating : 4.7,
    price : 677
});

testTour.save().then(doc => {
    console.log(doc);
}).catch(err => {
    console.log("Error+", err);
})


// SERVER

// Listening on specific port

const port = 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}..!`);
});