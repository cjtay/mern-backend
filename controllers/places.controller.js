const HttpError = require('../models/http-error');
const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../util/location');

const Place = require('../models/place');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Haji Lane 2',
        description: 'Little Insadong',
        location: {
            lat: 1.3008978,
            lng: 103.8588572
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Bugis Street 2',
        description:
            'Lively shopping street with dozens of apparel shops, food markets, souvenir stores & eateries.',
        location: {
            lat: 1.3006044,
            lng: 103.8527043
        },
        creator: 'u1'
    }
];

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('System error, cannot find place', 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError(
            'Could not find place for the provided place ID',
            404
        );
        return next(error);
    }
    res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;
    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError('System error', 500);
        return next(error);
    }

    if (!places || places.length === 0) {
        return next(
            new HttpError('Could not find places for the provided user ID', 404)
        );
    }

    res.json({
        places: places.map(place => place.toObject({ getters: true }))
    });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs passed, please check data', 422)
        );
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image:
            'https://images.unsplash.com/photo-1555947970-15e7a8a0bb73?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2989&q=80&SameSite=None&secure',
        creator
    });

    try {
        await createdPlace.save();
    } catch (err) {
        const error = new HttpError('Creating place failed', 500);
        return next(error);
    }
    res.status(200).json({ places: createdPlace });
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check data', 422);
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('System error', 500);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError('System error', 500);
        return next(error);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('System error', 500);
        return next(error);
    }

    try {
        await place.deleteOne();
    } catch (err) {
        const error = new HttpError('System error', 500);
        return next(error);
    }

    res.status(201).json({
        message: 'deleted successfully'
    });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

// alternatives syntax for functions
// function getPlaceById() { ... }
// const getPlaceById = function() { ... }
