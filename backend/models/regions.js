const { Schema, model } = require('mongoose');

// City Schema
const citySchema = new Schema({
    name: {
        type: String,
        unique: true
    }
});

const city = model('City', citySchema);

// Country Schema
const countrySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    cities: [{
        type: Schema.Types.ObjectId,
        ref: 'City'
    }]
});

const country = model('Country', countrySchema);

// Region Schema
const regionSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    countries: [{
        type: Schema.Types.ObjectId,
        ref: 'Country'
    }]
});

const region = model('Region', regionSchema);

module.exports = { regionSchema: region, countrySchema: country, citySchema: city };
