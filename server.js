// Importing the Modules

const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT REJECTION. Shutting down ..!');
    process.exit(1);
});

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

// SERVER

// Listening on specific port

const port = 8000;

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}..!`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION. Shutting down ..!');
    server.close(() => {
        process.exit(1);
    });
});
