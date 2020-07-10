// Importing the Modules

const dotenv = require('dotenv');

// SET Environment Variables

dotenv.config({ path : './config.env' });

const app = require('./app');

// console.log(process.env);

// SERVER

// Listening on specific port

const port = 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}..!`);
});