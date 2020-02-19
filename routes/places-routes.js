const express = require('express');
const HttpError = require('../models/http-error');

const router = express.Router();

const DUMMY_PLACES = [
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

router.get('/:pid', (req, res, next) => {
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
});

router.get('/user/:uid', (req, res, next) => {
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
});

module.exports = router;
