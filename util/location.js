const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyDjgJ_cw6tdXvvZooft-FsFEyAOS8GGjhs';

async function getCoordsForAddress(address) {
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${API_KEY}`
    );

    const data = response.data;

    if (!data || data.status === 'ZERO RESULTS') {
        throw new HttpError('Could not find location', 422);
    }

    const coordinates = data.results[0].geometry.location;

    return coordinates;
}

module.exports = getCoordsForAddress;
