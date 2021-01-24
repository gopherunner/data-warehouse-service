const { Router } = require('express');
const cityRouter = Router();
const { createCity, updateCity, deleteCity, getCities } = require('../db/cities');

// Create City endpoint
cityRouter.post('/:_id', async (req, res) => {
    try {
        const city = req.body;
        const countryId = req.params;
        // console.log("[DEBUG] City body => " + newCity);
        const cityCreated = await createCity(city, countryId);
        if (cityCreated) {
            res.status(201).jsonp({ id: cityCreated._id });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: 'Error while creating the City: ' + error.message });
    }
});

// Get Cities endpoint
cityRouter.get('/', async (req, res) => {
    try {
        const cities = await getCities();

        if (cities) {
            res.status(201).jsonp({ data: cities });
        } else {
            res.status(401).jsonp({ msg: "There was an error while trying to retrieve the Cities" });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: 'Error while getting the Cities: ' + error.message });
    }
});

// Update City endpoint
cityRouter.put('/:_id', async (req, res) => {
    try {
        const newCity = req.body;
        const cityId = req.params;
        const cityUpdated = await updateCity(newCity, cityId);
        if (cityUpdated) {
            res.status(201).jsonp({ id: cityUpdated._id });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: 'Error while updating the City: ' + error.message });
    }
});

// Delete City endpoint
cityRouter.delete('/:_id', async (req, res) => {
    try {
        const cityId = req.params;
        const deletedCity = await deleteCity(cityId);
        if (deletedCity) {
            res.status(201).jsonp({ id: deletedCity._id });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: 'Error while deleting the City: ' + error.message });
    }
});

module.exports = cityRouter;
