const HttpError = require('../models/http-error');
const uuid = require('uuid/v4');

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
        creator: 'u2'
    }
];

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if (!place) {
        throw new HttpError(
            'Could not find place for the provided place ID',
            404
        );
    }
    res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId;
    });
    if (!place) {
        return next(
            new HttpError('Could not find place for the provided user ID', 404)
        );
    }

    res.json({ place });
};

const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
    const { title, description } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

    res.status(201).json({
        message: 'deleted successfully'
    });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

// alternatives syntax for functions
// function getPlaceById() { ... }
// const getPlaceById = function() { ... }
