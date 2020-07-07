// Importing the required libraries

const express = require('express');

// Creating / Initializing an express app

const app = express();

// Defining Routes

app.get('/', (req, res) => {
    //res.status(200).send("Hi from the server!");
    res.json({'message' : 'Hi from the server'});
})

// Listening on specific port

const port = 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}..!`);
});