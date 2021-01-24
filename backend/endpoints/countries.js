const { Router } = require('express');
const countryRouter = Router();
const { createCountry, updateCountry, deleteCountry } = require('../db/countries');

// Create Country endpoint
countryRouter.post('/:_id', async (req, res) => {
    try {
        const country = req.body;
        const countryId = req.params;
        console.log("[DEBUG] Country body => " + country);
        const countryCreated = await createCountry(country, countryId);
        if (countryCreated) {
            res.status(201).jsonp({ id: countryCreated._id });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: 'Error while creating the Country: ' + error.message });
    }
});

// Update Country endpoint
countryRouter.put('/:_id', async (req, res) => {
    try {
        const newCountry = req.body;
        const countryId = req.params;
        const countryUpdated = await updateCountry(newCountry, countryId);
        if (countryUpdated) {
            res.status(201).jsonp({ id: countryUpdated._id });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: 'Error while updating the Country: ' + error.message });
    }
});

// Delete Country endpoint
countryRouter.delete('/:_id', async (req, res) => {
    try {
        const countryId = req.params;
        const deletedCountry = await deleteCountry(countryId);
        if (deletedCountry) {
            res.status(201).jsonp({ id: deletedCountry._id });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: 'Error while deleting the Country: ' + error.message });
    }
});

module.exports = countryRouter;
