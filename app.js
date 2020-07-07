// Importing the required libraries

const express = require('express');
const fs = require('fs');

// Creating / Initializing an express app

const app = express();

// Defining Routes

// app.get('/', (req, res) => {
//     //res.status(200).send("Hi from the server!");
//     res.json({'message' : 'Hi from the server'});
// })

// Reading file synchronously at once

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status : 'Success',
        results : tours.length,
        data : {
            tours
        }
    });
});

// Listening on specific port

const port = 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}..!`);
});