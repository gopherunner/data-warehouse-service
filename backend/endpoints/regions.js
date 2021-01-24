const { Router } = require('express');
const regionRouter = Router();
const { getRegions, createRegion, updateRegion, deleteRegion } = require('../db/regions');

regionRouter.get('/', async (req, res) => {
    try {
        let regions = await getRegions();
        if (regions) {
            // res.status(201).json({ msg: "Regions retrieved successfully", data: regions });
            res.status(201).jsonp({ data: regions });
        } else {
            res.status(401).jsonp({ msg: "There was an error while trying to retrieve the Regions" });
        }
    } catch(err) {
        res.status(500).jsonp({ err: 'There was an error while getting the Regions' });
    }
});

regionRouter.post('/', async (req, res) => {
    try {
        const region = req.body;
        // console.log("[DEBUG] Region body => " + region);
        const regionCreated = await createRegion(region);
        if (regionCreated) {
          res.status(201).jsonp({ id: regionCreated._id });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: 'Error while creating the Region: ' + error.message });
    }
});

// Update Region endpoint
regionRouter.put('/:_id', async (req, res) => {
    try {
        const newRegion = req.body;
        const regionId = req.params;
        const regionUpdated = await updateRegion(newRegion, regionId);
        res.status(201).jsonp({ id: regionUpdated._id });
    } catch (error) {
        res.status(400).jsonp({ msg: 'Error while updating the Region: ' + error.message });
    }
});

// Delete Region endpoint
regionRouter.delete('/:_id', async (req, res) => {
    try {
        const regionId = req.params;
        const deletedRegion = await deleteRegion(regionId);
        res.status(201).jsonp({ id: deletedRegion._id });
    } catch (error) {
        res.status(400).jsonp({ msg: 'Error while deleting the Region: ' + error.message });
    }
});

module.exports = regionRouter;
