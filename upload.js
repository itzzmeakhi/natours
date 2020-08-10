// multer package
// To handle form multi part data

// npm install multer

const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const userController = require('./controllers/userController');
const AppError = require('./utils/appError');

const router = express.Router();

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false);
    }
};

// const upload = multer.upload({
//     dest : 'public/img/users'
// });

const upload = multer.upload({
    storage: multerStorage,
    fileFilter: multerFilter
});


// Resize the image using sharp package

// npm install sharp

const multerStorage = multer.memoryStorage();

// To store image as an buffer

exports.resizeImage = (req, res, next) => {
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality : 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
};


router.patch('/updateMe', upload.single('photo'), userController.updateMe);

// Then after multer middleware is executed, the next middle ware following it will be executed.
// req.body
// req.file

