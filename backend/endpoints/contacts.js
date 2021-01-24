const { Router } = require('express');
const contactRouter = Router();
const { createContact, getContacts, getContact, deleteContacts, updateContact, sortContacts } = require('../db/contacts');

// Get all Contacts
contactRouter.get('/', async (req, res) => {

    try {
        const contacts = await getContacts();
        if (contacts) {
            res.status(200).jsonp({ contacts: contacts });
        }
    } catch(err) {
        res.status(500).jsonp({ err: 'There was an error while getting the Contacts' });
    }
});

// Get specific Contact
contactRouter.get('/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const contactFound = await getContact(contactId);
        if (contactFound) {
            res.status(200).jsonp({ data: contactFound });
        }
    } catch (error) {
        res.status(400).jsonp({ msg: err.message });
    }
});

// Get sorted contacts
contactRouter.get('/sort-by/:field&:order', async (req, res) => {
    try {
        let field = req.params.field;
        let order = req.params.order;
        const contactSorted = await sortContacts(field, order);
        if (contactSorted) {
            res.status(200).jsonp({ data: contactSorted});
        }
    } catch (error) {
        res.status(400).jsonp({ msg: error.message });
    }
});

// Create contact
contactRouter.post('/', async (req, res) => {
    try {
        const contact = req.body;
        const contactCreated = await createContact(contact);
        res.status(201).jsonp({ id: contactCreated._id });
    } catch (error) {
        res.status(400).jsonp({ msg: error.message });
    }
});

// Delete contact
contactRouter.delete('/', async (req, res) => {
    try {
        const contacts = req.body;
        const contactsDeleted = await deleteContacts(contacts);
        res.status(201).jsonp({ status: contactsDeleted.status });
    } catch (error) {
        res.status(400).jsonp({ msg: error.message });
    }
});

// Update contact
contactRouter.put('/:_id', async (req, res) => {
    try {
        const contactId = req.params;
        const contact = req.body;
        const contactUpdated = await updateContact(contactId, contact);
        res.status(201).jsonp({ status: contactUpdated.status });
    } catch (error) {
        res.status(400).jsonp({ msg: error.message });
    }
});

module.exports = contactRouter;
