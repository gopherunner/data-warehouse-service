const { citySchema, countrySchema, regionSchema } = require('../models/regions');

// Create a new City
async function createCity(city, id) {
    try {
        let country = await countrySchema.findById(id);

        if (country) {
            let cityExists = await citySchema.find(city);
            if (cityExists == '') {
                // Create the City
                let createdCity = new citySchema(city);
                // Save the City and get the Id
                let { _id } = await createdCity.save();
                // Push the new City inside the corresponding Country
                await country.cities.push(createdCity);
                // Save the Country
                await country.save();

                console.log("[INFO] City successfully created with ID: " + _id);
                return createdCity;
            } else {
                console.log("[ERROR] The City that you are trying to create already exists!");
            }
        } else {
            console.log("[ERROR] There is no Country with that ID");
        }
    } catch(error) {
        console.log("[ERROR] There was an error while trying to create the City, error msg: " + error.message);
    }
};

async function getCities() {
    try {
        let cities = await citySchema.find({}, {
            __v: 0,
            _id: 0
        });

        if (cities) {
            return cities;
        }
    } catch (error) {
        console.log("[ERROR] There was an error while trying to get the Cities, error msg: " + error.message);
    }
};

// Update an existing City
async function updateCity(city, id) {
    try {
        let cityUpdated = await citySchema.updateOne(id, city);
        if (cityUpdated) {
            console.log("[INFO] Country successfully updated!");
            return cityUpdated;
        } else {
            console.log("[ERROR] There is no City with that ID");
        }
    } catch (error) {
        console.log("[ERROR] There was an error while trying to update the Country");
    }
};

// Delete an existing City
async function deleteCity(id) {
    try {
        let deletedCity = await citySchema.findByIdAndDelete(id);
        if (deletedCity) {
            console.log("[INFO] City successfully deleted!");
            return deletedCity;
        } else {
            console.log("[ERROR] There is no City with that ID");
        }
    } catch (error) {
        console.log("[ERROR] There was an error while trying to delete the Country, error msg: " + error.message);
    }
};

module.exports = { createCity, getCities, updateCity, deleteCity };
