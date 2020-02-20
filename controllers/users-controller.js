const HttpError = require('../models/http-error');
const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Tay',
        email: 'tay@test.com',
        password: 'test123'
    },
    {
        id: 'u2',
        name: 'Jenny',
        email: 'jenny@test.com',
        password: 'test123'
    }
];

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check data', 422);
    }

    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if (hasUser) {
        throw new HttpError('Email already exist', 401);
    }

    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser);
    res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Invalid Login', 401);
    }
    res.json({ message: 'Login successful' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
