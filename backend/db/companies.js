const { companySchema } = require('../models/companies');
const { citySchema } = require('../models/regions');

// Get all the available Companies
async function getCompanies() {
    try {
        let companies = await companySchema.find({}, {__v:0}).populate(
           {
               path: 'city',
               select: 'name'
           } 
        );
        return companies;
    } catch (error) {
        console.log("[ERROR] While trying to run the getCompanies() function, error msg: " + error);
    }
};

async function getCompany(companyId) {
    try {
        let company = await companySchema.findById(companyId);
        if (company) {
            return company;
        }
    } catch (error) {
        console.log("[ERROR] While trying to get the specific Company with Id: " + companyId + ", error msg: " + error.message);
    }
};


// Create a new Company
async function createCompany(company, cityName) {
    try {
        // if (cityName.length <= 1) throw "The name of the city is invalid!";
        console.log("[DEBUG] City Name: " + cityName);
        // Search for the city that the company belongs too
        let city = await citySchema.findOne({ name: cityName });

        if (city) {
            console.log("[DEBUG] Company: " + company);
            let companyToCreate = new companySchema(company);
            // Save the Company and get the ID
            let { _id } = await companyToCreate.save();
            // Add the City to the Company
            let companyCreated = await companySchema.findById(_id);
            await companyCreated.city.push(city);
            let companySaved = await companyCreated.save();
            console.log("[INFO] Company successfully created with ID: " + companySaved);
            return companySaved;
        } else {
            console.log("[ERROR] The City entered does not exist!");
        }
    } catch(error) {
        console.log("[ERROR] While trying to create the Company, error msg: " + error);
    }
};

// Update an existing Company
async function updateCompany(companyId, city, company) {
    try {
        let retrieveCity = await citySchema.findOne({ name: city });
        let { _id } = await companySchema.findByIdAndUpdate(companyId, company);

        let updatedCompany = await companySchema.findById(_id);

        await updatedCompany.city.pop();
        await updatedCompany.city.push(retrieveCity);
        await updatedCompany.save();

        console.log("[INFO] Company successfully updated!");
        return updatedCompany;
    } catch (error) {
        console.log("[ERROR] There was an error while trying to update the Company");
    }
};

// Delete an existing Company
async function deleteCompany(companyId) {
    try {
        if (companyId) {
            console.log(companyId);
            let deletedCompany = await companySchema.findByIdAndDelete(companyId);
            if (deletedCompany) {
                console.log("[INFO] Company successfully deleted!");
                return deletedCompany;
            } else {
                console.log("[ERROR] There is no Company with that ID");
            }
        } else {
            console.log("[ERROR] There was an error with the Company ID");
        }
    } catch (error) {
        console.log("[ERROR] There was an error while trying to delete the Company, error msg: " + error.message);
    }
};

async function sortCompanies(field, order) {
    try {
        let companies = await companySchema.find({}, {__v:0}).populate(
            {
                path: 'company region country city',
                select: 'name'
            }
        ).sort({[field]: [order]});
        return companies;
    } catch (error) {
        console.log("[ERROR] While trying to get companies sorted, error msg: " + error.message);
    }
};

module.exports = { getCompanies, getCompany, createCompany, updateCompany, deleteCompany, sortCompanies };
