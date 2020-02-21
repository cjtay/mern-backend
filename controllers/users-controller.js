const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError('System error in retrieving users', 500);
        return next(error);
    }

    res.status(201).json({
        users: users.map(user => user.toObject({ getters: true }))
    });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs passed, please check data', 422)
        );
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'System error in finding existing user',
            500
        );
        return next(error);
    }

    if (existingUser) {
        console.log(existingUser);
        const error = new HttpError(
            'User already exist, please login instead',
            422
        );
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image:
            'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
        password,
        places: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('System error in creating user', 500);
        console.log(err);
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('System error validating email', 500);
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Invalid login credentials, please try again',
            401
        );
        return next(error);
    }

    res.json({ message: 'Login successful' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
