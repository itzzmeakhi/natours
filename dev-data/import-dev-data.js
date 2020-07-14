// Importing the Modules

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../models/tourModel');

// SET Environment Variables

dotenv.config({ path : './config.env' });

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


// READ JSON file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours-simple.json`, 'utf-8'));

// IMPORT Data into DB

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("DATA Inserted into the DB successfully");
        process.exit();
    } catch(error) {
        console.log(error);
    }
}

// DELETE ALL DATA from DB

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("DATA Deleted into the DB successfully");
        process.exit();
    } catch(error) {
        console.log(error);
    }
}

if(process.argv[2] === "--import") {
    importData();
} else if(process[2] === "--delete") {
    deleteData();
}


// console.log(process.argv);
// node dev-data/import-dev-data.js --import
