// Importing the required libraries

const express = require('express');
const fs = require('fs');

// Creating / Initializing an express app

const app = express();
app.use(express.json());

// Defining Routes

// app.get('/', (req, res) => {
//     //res.status(200).send("Hi from the server!");
//     res.json({'message' : 'Hi from the server'});
// })

// Reading file synchronously at once

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status : 'success',
        results : tours.length,
        data : {
            tours
        }
    });
});

app.post('api/v1/tours', (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id : newId }, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, tours, err => {
        res.status(201).json({
            status : 'success',
            data : {
                tour : newTour
            }
        });
    });
});

// Listening on specific port

const port = 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}..!`);
});