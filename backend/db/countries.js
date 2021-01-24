const { citySchema, countrySchema, regionSchema } = require('../models/regions');

// Create a new Country
async function createCountry(country, id) {
    try {
        let region = await regionSchema.findById(id);

        if (!region) throw "There is no Region with that Id";
        
        let countryExists = await countrySchema.find(country);

        if (countryExists != '') throw "There Country already Exists!";

        let newCountry = new countrySchema(country);
        let { _id } = await newCountry.save();

        await region.countries.push(newCountry);

        await region.save();

        console.log("[INFO] Country created successfully with Id: " + _id);
        return newCountry;
    } catch(error) {
        console.log("[ERROR] There was an error while trying to create the Country");
    }
};

// Update an existing Country
async function updateCountry(country, id) {
    try {
        let countryUpdated = await countrySchema.updateOne(id, country);
        if (countryUpdated) {
            console.log("[INFO] Country successfully updated!");
            return countryUpdated;
        }
    } catch (error) {
        console.log("[ERROR] There was an error while trying to update the Country");
    }
};

// Delete an existing Country
async function deleteCountry(id) {
    try {
        let { cities } = await countrySchema.findOne(id);

        // Before deleting the country, first I need to delete each city that belongs to the country
        cities.forEach(async (cityId) => {
            await citySchema.findByIdAndDelete(cityId);
        });

        // Delete the country at last
        let deletedCountry = await countrySchema.findByIdAndDelete(id);

        if (deletedCountry) {
            console.log("[INFO] Country successfully deleted!");
            return deletedCountry;
        }
    } catch (error) {
        console.log("[ERROR] There was an error while trying to delete the Country, error msg: " + error.message);
    }
};

module.exports = { createCountry, updateCountry, deleteCountry };
