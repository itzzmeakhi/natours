// Importing the Modules

const app = require('./app');

// SERVER

// Listening on specific port

const port = 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}..!`);
});