const { citySchema, countrySchema, regionSchema } = require('../models/regions');

// Create Region
async function createRegion(region) {
    try {
        const newRegion = new regionSchema(region);
        const { _id } = await newRegion.save();

        console.log("[INFO] Region created successfully! with Id: " + _id);
        return _id;
    } catch(error) {
        console.log("[ERROR] While trying to create the Region, error msg: " + error);
    }
};

// Get Regions
async function getRegions() {
    try {
        let regions = await regionSchema.find({}, {__v:0}).populate(
            {
                path: 'countries cities',
                select: 'name',
                populate: {
                    path: 'cities',
                    select: 'name'
                }
            }
        );

        return regions;
    } catch(error) {
        console.log("[ERROR] While trying to get the Regions!, error msg: " + error);
    }
};

// Update an existing Region
async function updateRegion(region, id) {
    try {
        let regionUpdated = await regionSchema.updateOne(id, region);
        if (regionUpdated) {
            console.log("[INFO] Region successfully updated!");
            return regionUpdated;
        }
    } catch (error) {
        console.log("[ERROR] There was an error while trying to update the Region");
    }
};

// Delete an existing Region
async function deleteRegion(id) {
    try {
        // Search for the region
        let { countries } = await regionSchema.findOne(id);

        // Before deleting the region, first I need to delete each city that belongs to the country, and finally the country
        countries.forEach(async (countryId) => {
            // Find the ids of the cities on each country inside the region
            let { cities } = await countrySchema.findById(countryId);

            // Delete each city
            cities.forEach(async (cityId) => {
                await citySchema.findByIdAndDelete(cityId);
            });

            // Finally, delete the Country
            await countrySchema.findByIdAndDelete(countryId);
        });

        // Now I can delete the Region
        let deletedRegion = await regionSchema.findByIdAndDelete(id);

        if (deletedRegion) {
            console.log("[INFO] Region successfully deleted!");
            return deletedRegion;
        }
    } catch (error) {
        console.log("[ERROR] There was an error while trying to delete the Region, error msg: " + error.message);
    }
};

module.exports = { createRegion, getRegions, updateRegion, deleteRegion };
