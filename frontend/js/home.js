const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const signOutBtn = document.getElementById("nav-sign-out");

const addContactBtn = document.getElementById('createContact');
const addContactContainer = document.getElementById('newContactContainer');

const userNavItem = document.getElementById('user-nav-item');
const navMenu = document.getElementById('nav-menu');

// Contact fields
const contactName = document.getElementById('name');
const contactLastname = document.getElementById('lastname');
const contactPosition = document.getElementById('position');
const contactEmail = document.getElementById('email');
const contactCompany = document.getElementById('company');
const selectCompany = document.getElementsByClassName('select-picker')[0];
const selectRegion = document.getElementById('region');
const selectCountry = document.getElementById('country');
const selectCity = document.getElementById('city');
const contactAddress = document.getElementById('address');
const contactInterest = document.getElementById('interest');

// Primary channel
const contactPrimaryChannel = document.getElementById('primary-channel');
const contactPrimaryUserAccount = document.getElementById('primary-user-account');
const contactPrimaryPreference = document.getElementById('primary-preferences');
contactPrimaryUserAccount.disabled = true;
contactPrimaryPreference.disabled = true;

// Secondary channel
const contactSecondaryChannel = document.getElementById('secondary-channel');
const contactSecondaryUserAccount = document.getElementById('secondary-user-account');
const contactSecondaryPreference = document.getElementById('secondary-preferences');
contactSecondaryChannel.disabled = true;
contactSecondaryUserAccount.disabled = true;
contactSecondaryPreference.disabled = true;

let contactRangeOutput = document.getElementById('range-interest');
const btnSaveContact = document.getElementById('btn-submit');
const refreshTableBtn = document.getElementById('refresh-table');
const contactChannelData = document.getElementById('contact-channel-data');
const moreContactChannelData = document.getElementById('more-contact-channel-data');
const selectedContactsTotal = document.getElementById('selected-contacts');
selectedContactsTotal.innerText = '';
const deleteSelectedContacts = document.getElementById('delete-selected-contacts');
deleteSelectedContacts.style.display = 'none';

// Sorting
const sortByContact = document.getElementById('sort-contact');
const sortByCountry = document.getElementById('sort-country');
const sortByCompany = document.getElementById('sort-company');
const sortByPosition = document.getElementById('sort-position');
const sortByInterest = document.getElementById('sort-interest');

// Delete contact modal
const modalBody = document.getElementsByClassName('modal-body');
const deleteContactBtn = document.getElementById('delete-contact-btn');

let selectedContacts = [];
let contactsCounter = 0;

// Update contact modal
const contactForm = document.getElementsByClassName('contact-form')[1];
const updateContactContainer = document.getElementById('updateContactContainer');
const contactNameUpdate = document.getElementById('update-name');
const contactLastnameUpdate = document.getElementById('update-lastname');
const contactPositionUpdate = document.getElementById('update-position');
const contactEmailUpdate = document.getElementById('update-email');
// const contactCompanyUpdate = document.getElementById('update-company');
const contactCompanyUpdate = document.getElementsByClassName('select-picker')[1];
const contactRegionUpdate = document.getElementById('update-region');
const contactCountryUpdate = document.getElementById('update-country');
const contactCityUpdate = document.getElementById('update-city');
const contactAddressUpdate = document.getElementById('update-address');
const contactInterestUpdate = document.getElementById('update-interest');
const contactRangeOutputUpdate = document.getElementById('update-range-span');
// Update Channel
const contactPrimaryChannelUpdate = document.getElementById('update-primary-channel');
const contactPrimaryUserAccountUpdate = document.getElementById('update-primary-user-account');
const contactPrimaryPreferenceUpdate = document.getElementById('update-primary-preferences');
// Secondary channel
const contactSecondaryChannelUpdate = document.getElementById('update-secondary-channel');
const contactSecondaryUserAccountUpdate = document.getElementById('update-secondary-user-account');
const contactSecondaryPreferenceUpdate = document.getElementById('update-secondary-preferences');

let updateContactBtn = document.getElementById('update-contact-btn');
let errorsUpdate = document.getElementById('update-errors');

// Errors
const errors = document.getElementById('errors');

// Update modal
const selectCompanyUpdate = document.getElementsByClassName('select-picker')[1];

// Contact table
let contactTable = document.getElementById('contacts-table');

const APP_SERVER = "http://127.0.0.1:3000";

// Search contacts
const searchContactInput = document.getElementById('search-contact-input');
const searchContactBtn = document.getElementById('search-contact-btn');

searchContactInput.addEventListener('change', () => {
    if (searchContactInput.value == '') {
        location.reload();
    }
});

addContactBtn.addEventListener('click', (event) => {
    event.preventDefault();
    addContactContainer.style.display = 'flex';
});

contactPrimaryChannel.addEventListener('change', () => {
    contactPrimaryUserAccount.disabled = false;
    contactPrimaryPreference.disabled = false;
    contactSecondaryChannel.disabled = false;
    contactSecondaryUserAccount.disabled = false;
    contactSecondaryPreference.disabled = false;
});

// SignOut button
signOutBtn.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.removeItem('token');
    location.href = "index.html";
});

// Table refresh listener
refreshTableBtn.addEventListener('click', (event) => {
    event.preventDefault();
    location.reload();
});

// Get all the Regions
async function getRegions() {
    let fetchRegions = await fetch(`${APP_SERVER}/regions`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let allRegions = await fetchRegions.json();
    let regions = allRegions.data;
    
    console.log(regions);

    if (regions) {
        return regions;
    } else {
        console.log("[ERROR] Regions: NO REGIONS FOUND!, error msg: " + regions);
    }
};

// Fill the selects from Regions, Countries and Cities
async function fillRegions(selectRegion, selectCountry, selectCity) {
    let regions = await getRegions();
    if (regions) {
        regions.forEach(region => {
            let option = document.createElement('option');
            option.innerText = region.name;
            option.id = region._id;
            selectRegion.appendChild(option);
        });

        // If I change the Region I need to fill the Countries based on the Region selected
        selectRegion.addEventListener('change', () => {
            selectCountry.innerHTML = '';
            selectCity.innerHTML = '';

            let region = regions.filter(reg => reg.name == selectRegion.value);
            let countries = region[0].countries;
            countries.forEach(country => {
                let countryOption = document.createElement('option');
                countryOption.innerText = country.name;
                countryOption.id = country._id;
                selectCountry.appendChild(countryOption);
            });

            let country = countries.filter(elem => elem.name == selectCountry.value);
            let cities = country[0].cities;

            cities.forEach(city => {
                let cityOption = document.createElement('option');
                cityOption.innerText = city.name;
                cityOption.id = city._id;
                selectCity.appendChild(cityOption);
            });
        });

        // Now I need to fill the cities based on the country selected
        selectCountry.addEventListener('change', () => {
            selectCity.innerHTML = '';

            let region = regions.filter(elem => elem.name ==  selectRegion.value);
            let countries = region[0].countries;

            let country = countries.filter(elem => elem.name == selectCountry.value);
            let cities = country[0].cities;

            cities.forEach(city => {
                let cityOption = document.createElement('option');
                cityOption.innerText = city.name;
                cityOption.id = city._id;
                selectCity.appendChild(cityOption);
            });
        });
    }
};

// Check Auth profile listener
document.addEventListener('DOMContentLoaded', checkAuthProfile);

async function checkAuthProfile() {
    if (profile == 'user') {
        userNavItem.remove();
    }
    if (token === null) {
        location.href = "index.html";
    }
};

// Fill regions listener
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault();
    fillRegions(selectRegion, selectCountry, selectCity);
});

document.addEventListener('DOMContentLoaded', fillRegions(contactRegionUpdate, contactCountryUpdate, contactCityUpdate));

// Populate Contacts in table
document.addEventListener('DOMContentLoaded', getContacts);

// Populate Company select
document.addEventListener('DOMContentLoaded', fillCompanies);

// Listener on Save contact btn
btnSaveContact.addEventListener('click', createContact);

// Search contacts listener
searchContactBtn.addEventListener('click', searchContacts);

// Interest listener
contactInterest.addEventListener('change', () => {
    rangeOutputValue(contactInterest, contactRangeOutput);
});

// Contact select total listener
selectedContactsTotal.addEventListener('click', checkSelectedContactsTotal);

// Delete contacts selected listener
deleteContactBtn.addEventListener('click', deleteAllSelectedContacts);

// Delete selected contacts from localStorage listener
document.addEventListener('DOMContentLoaded', deleteSelectedContactsFromLocal);

// Update Contact listener
updateContactBtn.addEventListener('click', updateContact);

// Interest Range output listener
contactInterestUpdate.addEventListener('change', () => {
    rangeOutputValue(contactInterestUpdate, contactRangeOutputUpdate);
});


// Sorting listeners
let contactOrder = 0;
let countryOrder = 0;
let companyOrder = 0;
let positionOrder = 0;
let interestOrder = 0;

sortByContact.addEventListener('click', () => {
    if (contactOrder == 0) {
        contactOrder = 1;
    } else if (contactOrder == 1) {
        contactOrder = -1;
    } else if (contactOrder == -1) {
        contactOrder = 1;
    }
    sortTableByColumn('name', contactOrder);
});

sortByCountry.addEventListener('click', () => {
    if (countryOrder == 0) {
        countryOrder = 1;
    } else if (countryOrder == 1) {
        countryOrder = -1;
    } else if (countryOrder == -1) {
        countryOrder = 1;
    }
    sortTableByColumn('country', countryOrder);
});

sortByCompany.addEventListener('click', () => {
    if (companyOrder == 0) {
        companyOrder = 1;
    } else if (companyOrder == 1) {
        companyOrder = -1;
    } else if (companyOrder == -1) {
        companyOrder = 1;
    }
    sortTableByColumn('company', companyOrder);
});

sortByPosition.addEventListener('click', () => {
    if (positionOrder == 0) {
        positionOrder = 1;
    } else if (positionOrder == 1) {
        positionOrder = -1;
    } else if (positionOrder == -1) {
        positionOrder = 1;
    }
    sortTableByColumn('position', positionOrder);
});

sortByInterest.addEventListener('click', () => {
    if (interestOrder == 0) {
        interestOrder = 1;
    } else if (interestOrder == 1) {
        interestOrder = -1;
    } else if (interestOrder == -1) {
        interestOrder = 1;
    }
    sortTableByColumn('interest', interestOrder);
});

async function sortTableByColumn(field, order) {
    let fetchSortedContacts = await fetch(`${APP_SERVER}/contacts/sort-by/${field}&${order}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let sortedContacts = await fetchSortedContacts.json();
    let contacts = sortedContacts.data;

    contactTable.innerHTML = '';
    contacts.forEach(contact => {
        addContactRowToTable(contact);
    });
};

async function updateContact(event) {
    event.preventDefault();

    let contactId = contactForm.id;
    let companyId;

    if (contactCompanyUpdate.options[contactCompanyUpdate.selectedIndex] != undefined){
        companyId = contactCompanyUpdate.options[contactCompanyUpdate.selectedIndex].id;
    }

    let regionId;
    let countryId;
    let cityId;

    if (contactRegionUpdate.options[contactRegionUpdate.selectedIndex] != undefined && contactCountryUpdate.options[contactCountryUpdate.selectedIndex] != undefined
        && contactCityUpdate.options[contactCityUpdate.selectedIndex] != undefined){

        regionId = contactRegionUpdate.options[contactRegionUpdate.selectedIndex].id;
        countryId = contactCountryUpdate.options[contactCountryUpdate.selectedIndex].id;
        cityId = contactCityUpdate.options[contactCityUpdate.selectedIndex].id;
    }

    let updatedContact = {
        name: contactNameUpdate.value,
        lastname: contactLastnameUpdate.value,
        position: contactPositionUpdate.value,
        email: contactEmailUpdate.value,
        company: companyId,
        region: regionId,
        country: countryId,
        city: cityId,
        address: contactAddressUpdate.value,
        interest: contactRangeOutputUpdate.innerText,
        contactChannels: []
    };

    let primaryChannelUpdate = {
        contactChannel: contactPrimaryChannelUpdate.value,
        userAccount: contactPrimaryUserAccountUpdate.value,
        preferences: contactPrimaryPreferenceUpdate.value
    };

    if (primaryChannelUpdate.contactChannel != 'Select channel') {
        updatedContact.contactChannels.push(primaryChannelUpdate);
    }

    let secondaryChannelUpdate = {
        contactChannel: contactSecondaryChannelUpdate.value,
        userAccount: contactSecondaryUserAccountUpdate.value,
        preferences: contactSecondaryPreferenceUpdate.value
    };

    if (secondaryChannelUpdate.contactChannel != '' && secondaryChannelUpdate.userAccount != '' && secondaryChannelUpdate.preferences != '') {
        updatedContact.contactChannels.push(secondaryChannelUpdate);
    }

    let contactToUpdate = await fetch(`${APP_SERVER}/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedContact)
    });

    let contactUpdate = await contactToUpdate.json();

    if (contactUpdate) {
        location.reload();
    }
};

function checkSelectedContactsTotal() {
    let allSelectedContacts = checkSelectedContact();
    let selectedContactsTotal = allSelectedContacts.length;

    if (selectedContactsTotal == 1) {
        modalBody[1].innerText = `Are you sure that you want to delete the contact?`;
        deleteContactBtn.removeAttribute('disabled');
    } else if (selectedContactsTotal > 1) {
        modalBody[1].innerText = `Are you sure that you want to delete the ${selectedContactsTotal} contacts selected?`;
        deleteContactBtn.removeAttribute('disabled');
    }
};

function rangeOutputValue(contactInterest, contactRangeOutput){

    let value = contactInterest.value;
    if(value == 0) contactRangeOutput.innerText = '0';
    if(value == 1) contactRangeOutput.innerText = '25';
    if(value == 2) contactRangeOutput.innerText = '50';
    if(value == 3) contactRangeOutput.innerText = '75';
    if(value == 4) contactRangeOutput.innerText = '100';
};

async function fillCompanies() {
    let fetchCompanies = await fetch(`${APP_SERVER}/companies`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let retrievedCompanies = await fetchCompanies.json();
    let companies = retrievedCompanies.companies;

    companies.forEach(company => {
        let option = document.createElement('option');
        option.innerText = company.name;
        option.id = company._id;
        selectCompany.appendChild(option);
    });

    companies.forEach(company => {
        let option = document.createElement('option');
        option.innerText = company.name;
        option.id = company._id;
        selectCompanyUpdate.appendChild(option);
    });

    $('.selectpicker').selectpicker('refresh');
};

// Get Contacts
async function getContacts() {
    let fetchContacts = await fetch(`${APP_SERVER}/contacts`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let contactsRetrieved = await fetchContacts.json();
    let contacts = contactsRetrieved.contacts;

    contactTable.innerHTML = '';
    contacts.forEach(contact => {
        addContactRowToTable(contact);
    });
};

function deleteSelectedContactsFromLocal() {
    localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
};

function addContactRowToTable(contact) {
    let contactId = contact._id;
    let name = contact.name;
    let lastname = contact.lastname;
    let position = contact.position;
    let email = contact.email;
    let company = '';
    if (contact.company[0]) {
        company = contact.company[0].name;
    }
    let region, country, city;
    let interest = contact.interest;

    if (contact.region[0] == undefined || contact.country[0] == undefined || contact.city[0] == undefined) {
        region = '';
        country = '';
        city = '';
    } else {
        region = contact.region[0].name;
        country = contact.country[0].name;
        city = contact.city[0].name;
    }

    let contactChannels = contact.contactChannel;

    let contactRow = document.createElement('div');
    let contactCheckbox = document.createElement('input');
    let contactDivFirst = document.createElement('div');
    let contactName = document.createElement('p');
    let smallEmail = document.createElement('small');

    // Region
    let contactCountryRegDiv = document.createElement('div');
    let pCountry = document.createElement('p');
    let smallRegion = document.createElement('small');
    let contactDivThird = document.createElement('div');
    let contactDivForth = document.createElement('div');
    let contactInterestDiv = document.createElement('div');

    arrangeContactChannels(contactChannels, contactInterestDiv);

    let contactDivSix = document.createElement('div');
    let divProgress = document.createElement('div');
    let divProgressBar = document.createElement('div');

    let contactManageDiv = document.createElement('div');
    let contactEdit = document.createElement('i');

    contactRow.className = 'contact-row';
    contactRow.id = contactId;
    contactCheckbox.className = 'contact-checkbox';


    contactDivFirst.className = 'contact-info';
    contactCountryRegDiv.className = 'contact-info';
    contactDivThird.className = 'contact-info';
    contactDivForth.className = 'contact-info';
    contactInterestDiv.className = 'contact-info';
    contactDivSix.className = 'contact-info';
    divProgress.className = 'progress';
    divProgressBar.className = 'progress-bar';

    contactCheckbox.setAttribute('type','checkbox')
    divProgressBar.setAttribute('role','progressbar');
    divProgressBar.setAttribute('style',`width: ${interest}%`);
    if(interest == 25) divProgressBar.style.backgroundColor = '#1EC1F5';
    if(interest == 50) divProgressBar.style.backgroundColor = '#FFC700';
    if(interest == 75) divProgressBar.style.backgroundColor = '#FE6F00';
    if(interest == 100) divProgressBar.style.backgroundColor = '#DF0028';
    divProgressBar.innerText = `${interest}%`;

    contactManageDiv.className = 'contact-edit';
    contactEdit.className = 'fas fa-user-edit';
    contactEdit.setAttribute('data-target','#updateModal');
    contactEdit.setAttribute('data-toggle','modal');

    contactName.innerText = `${name} ${lastname}`;
    smallEmail.innerText = email;

    pCountry.innerText = country;
    smallRegion.innerText = region;

    contactDivThird.innerText = company;
    contactDivForth.innerText = position;

    contactDivFirst.appendChild(contactName);
    contactDivFirst.appendChild(smallEmail);

    contactCountryRegDiv.appendChild(pCountry);
    contactCountryRegDiv.appendChild(smallRegion);

    divProgress.appendChild(divProgressBar);
    contactDivSix.appendChild(divProgress);

    contactRow.appendChild(contactCheckbox);
    contactRow.appendChild(contactDivFirst);
    contactRow.appendChild(contactCountryRegDiv);
    contactRow.appendChild(contactDivThird);
    contactRow.appendChild(contactDivForth);
    contactRow.appendChild(contactInterestDiv);
    contactRow.appendChild(contactDivSix);

    contactManageDiv.appendChild(contactEdit);
    contactRow.appendChild(contactManageDiv);

    contactTable.appendChild(contactRow);

    // Contact Edit listener
    contactEdit.addEventListener('click', async () => {
        updateContactContainer.style.display = 'flex';
        let contactRetrieved = await getContactById(contactId);
        renderContactUpdateModal(contactRetrieved);
    });

    // Contact selection listener
    contactCheckbox.addEventListener('change', function() {
        if (this.checked) {
            contactRow.className = 'contact-row selected-row';
            contactsCounter += 1;
            // Add the contact to the localStorage
            storeContact(contactId);
            selectedContactsTotal.innerText = `${contactsCounter} selected`;
        } else {
            contactRow.className = 'contact-row';
            contactsCounter -= 1;
            // Remove the contact from the localStorage
            removeContact(contactId);
            selectedContactsTotal.innerText = `${contactsCounter} selected`;
        }
    });
};

function removeContact(id) {
    let selectedContacts = checkSelectedContact();
    const selectedIndex = selectedContacts.indexOf(id);
    selectedContacts.splice(selectedIndex,1);
    if (selectedContacts.length == 0) {
        selectedContactsTotal.style.display = 'none';
        deleteSelectedContacts.style.display = 'none';
    }

    localStorage.setItem('selectedContacts',JSON.stringify(selectedContacts));
};

function checkSelectedContact() {
    let selectedContact;
    if (localStorage.getItem('selectedContacts') === null) {
        selectedContact = [];
    } else {
        selectedContact = JSON.parse(localStorage.getItem('selectedContacts'));
    }
    return selectedContact;
};

function storeContact(contactId) {
    let selectedContacts = checkSelectedContact();

    selectedContacts.push(contactId);
    localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
    if (selectedContacts.length > 0) {
        selectedContactsTotal.style.display = 'block';
        deleteSelectedContacts.style.display = 'block';
    }
};

function arrangeContactChannels(contactChannels, contactInterestDiv) {
    contactChannels.forEach(contactChannel => {
        contactChannel.forEach(channel => {
            if (channel.preferences == 'Favorite') {
                let channelDiv = document.createElement('div');
                channelDiv.className = 'channel';
                channelDiv.innerText = channel.contactChannel;

                // channelDiv.addEventListener('click', () => {
                //
                // });
                contactInterestDiv.appendChild(channelDiv);
            }
        });

        let favChannels = contactChannel.filter(channel => channel.preferences == 'Favorite');

        if (favChannels.length == 0) {
            let noChannelDiv = document.createElement('div');
            noChannelDiv.className = 'channel';
            noChannelDiv.innerText = 'Pending';
            contactInterestDiv.appendChild(noChannelDiv);
        }
    });
};

async function createContact(event) {
    event.preventDefault();

    let companyId;
    let regionId;
    let countryId;
    let cityId;

    if (contactCompany.options[contactCompany.selectedIndex] != undefined) {
        companyId = contactCompany.options[contactCompany.selectedIndex].id;
    }

    if (selectRegion.options[selectRegion.selectedIndex] != undefined &&
        selectCountry.options[selectCountry.selectedIndex] != undefined &&
        selectCity.options[selectCity.selectedIndex] != undefined) {
            regionId = selectRegion.options[selectRegion.selectedIndex].id;
            countryId = selectCountry.options[selectCountry.selectedIndex].id;
            cityId = selectCity.options[selectCity.selectedIndex].id;
    }

    let contactToCreate = {
        name: contactName.value,
        lastname: contactLastname.value,
        position: contactPosition.value,
        email: contactEmail.value,
        company: companyId,
        region: regionId,
        country: countryId,
        city: cityId,
        address: contactAddress.value,
        interest: contactRangeOutput.innerText,
        contactChannels: []
    };

    let primaryChannel = {
        contactChannel: contactPrimaryChannel.value,
        userAccount: contactPrimaryUserAccount.value,
        preferences: contactPrimaryPreference.value
    };

    if (primaryChannel.contactChannel != 'Select channel') {
        contactToCreate.contactChannels.push(primaryChannel);
    }

    let secondaryChannel = {
        contactChannel: contactSecondaryChannel.value,
        userAccount: contactSecondaryUserAccount.value,
        preferences: contactSecondaryPreference.value
    };

    if (secondaryChannel.contactChannel != '' && secondaryChannel.userAccount != '' && secondaryChannel.preferences != '') {
        contactToCreate.contactChannels.push(secondaryChannel);
    }

    console.table(contactToCreate);

    let contactCreated = await fetch(`${APP_SERVER}/contacts`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(contactToCreate)
    });

    let contact = await contactCreated.json();

    if (contact) {
        addContactContainer.style.display = 'none';
        location.reload();
    }
    console.log(contact);
};

// Render Contact info to Update modal
async function renderContactUpdateModal(contact) {

    contactForm.id = contact._id;
    contactNameUpdate.value = '';
    contactLastnameUpdate.value = '';
    contactPositionUpdate.value = '';
    contactEmailUpdate.value = '';
    contactAddressUpdate.value = '';
    contactRangeOutputUpdate.innerText = '';
    contactInterestUpdate.value = 0;

    contactNameUpdate.value = contact.name;
    contactLastnameUpdate.value = contact.lastname;
    contactPositionUpdate.value = contact.position;
    contactEmailUpdate.value = contact.email;

    // Primary Channel update
    contactPrimaryChannelUpdate.value = 'Select channel';
    contactPrimaryUserAccountUpdate.value = '';
    contactPrimaryPreferenceUpdate.value = 'No preference';

    // Secondary Channel update
    contactSecondaryChannelUpdate.value = 'Select channel';
    contactSecondaryUserAccountUpdate.value = '';
    contactSecondaryPreferenceUpdate.value = 'No preference';

    let companyUpdateOptions = Array.from($('.select-picker')[1].children);
    let contactCompany = companyUpdateOptions.find(option => option.innerText == contact.company[0].name);
    contactCompany.setAttribute('selected', true);
    $('.select-picker').selectpicker('refresh');

    contactAddressUpdate.value = contact.address;

    if (contact.region[0] != undefined && contact.country[0] != undefined && contact.city[0] != undefined) {
        let regionsOptions = Array.from(contactRegionUpdate.options);

        // console.log("[DEBUG] Region: " + contact.region[0].name);

        let indexRegion = regionsOptions.findIndex(option => option.value == contact.region[0].name);

        contactRegionUpdate.options.selectedIndex = indexRegion;

        let regionsRetrieved = await getRegions();
        console.log(regionsRetrieved);
        if (regionsRetrieved) {
            let region = regionsRetrieved.filter(elem => elem.name == contact.region[0].name);

            let countries = region[0].countries;

            contactCountryUpdate.innerHTML = '';
            countries.forEach(country => {
                // console.log("[DEBUG] Country: " + country.name);
                let countryOption = document.createElement('option');
                countryOption.innerText = country.name;
                countryOption.id = country._id;

                if (countryOption.innerText == contact.country[0].name) {
                    countryOption.setAttribute('selected', true);
                }
                contactCountryUpdate.appendChild(countryOption);
            });

            let country = countries.filter(elem => elem.name == contact.country[0].name);
            let cities = country[0].cities;

            contactCityUpdate.innerHTML = '';
            cities.forEach(city => {
                let cityOption = document.createElement('option');
                cityOption.innerText = city.name;
                cityOption.id = city._id;
                if (cityOption.innerText == contact.city[0].name) {
                    cityOption.setAttribute('selected', true);
                }
                contactCityUpdate.appendChild(cityOption);
            });
        }        
    } else {
        contactRegionUpdate.innerHTML = '<option selected disabled>Select region</option>';
        contactCountryUpdate.innerHTML = '';
        contactCityUpdate.innerHTML = '';
        let regions = await getRegions();
        regions.forEach(elem => {
            let option = document.createElement('option');
            option.innerText = elem.name;
            option.id = elem._id;
            contactRegionUpdate.appendChild(option);
        });
    }

    // Interest range output update
    contactRangeOutputUpdate.innerText = `${contact.interest}`;
    if(contact.interest == 0) contactInterestUpdate.value = 0;
    if(contact.interest == 25) contactInterestUpdate.value = 1;
    if(contact.interest == 50) contactInterestUpdate.value = 2;
    if(contact.interest == 75) contactInterestUpdate.value = 3;
    if(contact.interest == 100) contactInterestUpdate.value = 4;

    // Channels
    let contactChannels = contact.contactChannel[0];
    if (contactChannels != '') {
        if (contactChannels.length > 1) {
            contactPrimaryChannelUpdate.value = contactChannels[0].contactChannel;
            contactPrimaryUserAccountUpdate.value = contactChannels[0].userAccount;
            contactPrimaryPreferenceUpdate.value = contactChannels[0].preferences;

            contactSecondaryChannelUpdate.value = contactChannels[1].contactChannel;
            contactSecondaryUserAccountUpdate.value = contactChannels[1].userAccount;
            contactSecondaryPreferenceUpdate.value = contactChannels[1].preferences;
        } else {
            contactPrimaryChannelUpdate.value = contactChannels[0].contactChannel;
            contactPrimaryUserAccountUpdate.value = contactChannels[0].userAccount;
            contactPrimaryPreferenceUpdate.value = contactChannels[0].preferences;
        }
    }
};

async function getContactById(contactId) {
    let fetchContact = await fetch(`${APP_SERVER}/contacts/${contactId}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    let contact = await fetchContact.json();
    return contact.data;
};

async function searchContacts() {
    let searchValue = searchContactInput.value;
    // console.log("[DEBUG] Search value: " + searchValue);

    let fetchContacts = await fetch(`${APP_SERVER}/contacts`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let contactsRetrieved = await fetchContacts.json();
    let contacts = contactsRetrieved.contacts;

    if (contacts) {
        let findContact = '';

        let nameFound = contacts.filter(contact => contact.name == searchValue);
        if (nameFound != '') {
            findContact = nameFound;
        }

        let lastnameFound = contacts.filter(contact => contact.lastname == searchValue);
        if (lastnameFound != '') {
            findContact = lastnameFound;
        }

        let regionsFound = contacts.filter(contact => contact.region[0].name == searchValue);
        if (regionsFound != '') {
            findContact = regionsFound;
        }

        let countriesFound = contacts.filter(contact => contact.country[0].name == searchValue);
        if (countriesFound != '') {
            findContact = countriesFound;
        }

        let companiesFound = contacts.filter(contact => contact.company[0].name == searchValue);
        if (companiesFound != '') {
            findContact = companiesFound;
        }

        let positionsFound = contacts.filter(contact => contact.position == searchValue);
        if (positionsFound != '') {
            findContact = positionsFound;
        }

        // console.log("[DEBUG] Key found: " + findContact);

        if (findContact != '') {
            contactTable.innerHTML = '';
            findContact.forEach(contact => {
                addContactRowToTable(contact);
            });
        } else {
            searchContactInput.value = 'No results found';
        }
    }
};

// Delete all the selected contacts call
async function deleteAllSelectedContacts() {
    let selectedContacts = checkSelectedContact();

    let fetchDeletedContacts = await fetch(`${APP_SERVER}/contacts`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(selectedContacts)
    });

    let deletedContacts = await fetchDeletedContacts.json();

    if (deletedContacts) {
        location.reload();
    }
};
