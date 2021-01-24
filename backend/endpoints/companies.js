const { Router } = require('express');
const companyRouter = Router();
const { getCompanies, getCompany, createCompany, updateCompany, deleteCompany, sortCompanies } = require('../db/companies');

// Get Companies endpoint
companyRouter.get('/', async (req, res) => {

    try {
        const companies = await getCompanies();
        if (companies) {
            res.status(200).jsonp({ companies: companies });
        }
    } catch (err) {
        res.status(500).jsonp({ err: 'There was an error while getting the Companies' });
    } 
});

// Get Company by ID endpoint
companyRouter.get('/:_id', async (req, res) => {
    try {
        const companyId = req.params.id;
        const companyFound = await getCompany(companyId);
        if (companyFound) {
            res.status(200).jsonp({ data: companyFound });
        }
    } catch (err) {
        res.status(400).jsonp({ msg: err.message });
    }
});

// Get sorted companies
companyRouter.get('/sort-by/:field&:order', async (req, res) => {
    try {
        let field = req.params.field;
        let order = req.params.order;
        const companySorted = await sortCompanies(field, order);
        if (companySorted) {
            res.status(200).jsonp({ data: companySorted});
        }
    } catch (error) {
        res.status(400).jsonp({ msg: error.message });
    }
});

// Create Company endpoint
companyRouter.post('/:city', async (req, res) => {
    try {
        const company = req.body;
        const cityName = req.params.city;

        const companyCreated = await createCompany(company, cityName);
        if (companyCreated) {
            res.status(201).jsonp({ id: companyCreated._id });
        }
    } catch (err) {
        res.status(400).jsonp({ msg: 'Error while creating the Company: ' + err.message });
    }
});

// Update Company endpoint
companyRouter.put('/:id&:city', async (req, res) => {
    try {
        const companyId = req.params.id;
        const cityName = req.params.city;
        const company = req.body;
        const updated = updateCompany(companyId, cityName, company);
        if (updated) {
            res.status(201).jsonp({ msg: 'Company modified successfully! ' + updated });
        }
    } catch (err) {
        res.status(404).jsonp({ msg: 'Error while updating the Company: ' + err.message });
    }
});

// Delete Company endpoint
companyRouter.delete('/:_id', async (req, res) => {
    try {
        const companyId = req.params;
        const deletedCompany = await deleteCompany(companyId);
        if (deletedCompany) {
            res.status(201).jsonp({ id: deletedCompany._id });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: 'Error while deleting the Company:  ' + error.message });
    }
});

module.exports = companyRouter;
