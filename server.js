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
    useFindAndModify: false
})
.then(con => {
    console.log("DB connected successfully");
})


// SERVER

// Listening on specific port

const port = 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}..!`);
});