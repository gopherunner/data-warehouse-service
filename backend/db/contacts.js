const { contactSchema } = require('../models/contacts');

// Get all the available Contacts
async function getContacts() {
    try {
        let contacts = await contactSchema.find({}, {__v:0}).populate(
            {
                path: 'company region country city',
                select: 'name'
            }
        );
        return contacts;
    } catch(error) {
        console.log("[ERROR] While trying to get the Customers, error msg: " + error);
    }
};

// Get an specific Contact by ID
async function getContact(id) {
    try {
        let contact = await contactSchema.findById(id).populate(
            {
                path: 'company region country city',
                select: 'name'
            }
        );
        return contact;
    } catch(error) {
        console.log("[ERROR] While trying to get the Contact with Id: " + id + " , error msg: " + error);
    }
};

// Delete an existing contact
async function deleteContacts(contactIds) {
    try {
        contactIds.forEach(async (contactId) => {
            let deletedContact = await contactSchema.findByIdAndDelete({ _id: contactId });
            console.log(deletedContact);
        });
    } catch (error) {
        console.log("[ERROR] While trying to delete the Contacts, error msg: " + error);
    }
};

// Update an existing Contact
async function updateContact(id, contact) {
    try {
        let contactToBeUpdated = {
            name: contact.name,
            lastname: contact.lastname,
            position: contact.position,
            email: contact.email,
            address: contact.address,
            interest: contact.interest
        };

        let contactUpdated = await contactSchema.findByIdAndUpdate(id, contactToBeUpdated);

        if (contactUpdated) {
            let contactRetrieved = await contactSchema.findById(id);

            await contactRetrieved.contactChannel.pop();
            await contactRetrieved.contactChannel.push(contact.contactChannels);
            await contactRetrieved.region.pop();
            await contactRetrieved.region.push(contact.region);
            await contactRetrieved.country.pop();
            await contactRetrieved.country.push(contact.country);
            await contactRetrieved.city.pop();
            await contactRetrieved.city.push(contact.city);
            await contactRetrieved.company.pop();
            await contactRetrieved.company.push(contact.company);

            await contactRetrieved.save();

            console.log("[INFO] Contact updated successfully!");
            return contactRetrieved;
        }
    } catch (error) {
        console.log("[ERROR] While trying to update the Contact, error msg: " + error);
    }
};

// Create a new Contact
async function createContact(contact) {

    let { name, lastname, position, email, company, region, country, city, address, interest, contactChannels } = contact;

    try {
        let contactToBeCreated = {
            name: name,
            lastname: lastname,
            position: position,
            email: email,
            company: company,
            region: region,
            country: country,
            city: city,
            address: address,
            interest: interest
        };

        console.table(contactToBeCreated);

        let newContact = new contactSchema(contactToBeCreated);

        // Store and get the ID of the new Contact
        let { _id } = await newContact.save();

        let contactCreated = await contactSchema.findById(_id);
        await contactCreated.contactChannel.push(contactChannels);
        await contactCreated.save();

        console.log("[INFO] Contact created successfully with Id: " + _id);
        return contactCreated;
    } catch(error) {
        console.log("[ERROR] While trying to create the Contact, error msg: " + error);
    } 
};

async function sortContacts(field, order) {
    try {
        let contacts = await contactSchema.find({}, {__v:0}).populate(
            {
                path: 'company region country city',
                select: 'name'
            }
        ).sort({[field]: [order]});
        return contacts;
    } catch (error) {
        console.log("[ERROR] While trying to get contacts sorted, error msg: " + error.message);
    }
};

module.exports = { getContacts, getContact, createContact, deleteContacts, updateContact, sortContacts };

