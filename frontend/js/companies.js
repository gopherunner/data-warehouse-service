const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const userNavItem = document.getElementById('user-nav-item');
const signOutBtn = document.getElementById("nav-sign-out");

const addCompanyBtn = document.getElementById('createCompany');
const addCompanyContainer = document.getElementById('newCompanyContainer');

const companyName = document.getElementById('name');
const companyAddress = document.getElementById('address');
const companyEmail = document.getElementById('email');
const companyPhone = document.getElementById('phone');
const selectCity = document.getElementById('city');
const errors = document.getElementById('errors');
const btnSubmit = document.getElementById('btn-submit');

// Search fields
const searchCompanyInput = document.getElementById('search-company-input');
const searchCompanyBtn = document.getElementById('search-company-btn');

// Sorting
const sortByName = document.getElementById('sort-name');
const sortByAddress = document.getElementById('sort-address');
const sortByEmail = document.getElementById('sort-email');
const sortByPhone = document.getElementById('sort-phone');
const sortByCity = document.getElementById('sort-city');

const modalBody = document.getElementsByClassName('modal-body');
const deleteCompanyBtn = document.getElementById('delete-company-btn');

const updateName = document.getElementById('update-name');
const updateAddress = document.getElementById('update-address');
const updateEmail = document.getElementById('update-email');
const updatePhone = document.getElementById('update-phone');
const selectedCity = document.getElementById('selected-city');
const updateCitySelect = document.getElementById('update-city');
const updateCompanyBtn = document.getElementById('update-btn');

// Company table
let companyTable = document.getElementById('companies-table');

const APP_SERVER = "http://127.0.0.1:3000";

// Check Auth profile listener
document.addEventListener('DOMContentLoaded', checkAuthProfile);

addCompanyBtn.addEventListener('click', (event) => {
    event.preventDefault();

    addCompanyContainer.style.display = 'flex';
});

// SignOut button
signOutBtn.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.removeItem('token');
    location.href = "index.html";
});

async function checkAuthProfile() {
    if (profile == 'user') {
        userNavItem.remove();
    }
    if (token === null) {
        location.href = "index.html";
    }
};

// Filling the select options with the cities
document.addEventListener('DOMContentLoaded', fillCities);

// Get Companies
document.addEventListener('DOMContentLoaded', getCompanies);

// Create the new company
btnSubmit.addEventListener('click', createCompany);
// Delete company
deleteCompanyBtn.addEventListener('click', deleteCompany);
// Update company
updateCompanyBtn.addEventListener('click', updateCompany);

// Search listener
searchCompanyInput.addEventListener('change', () => {
    if (searchCompanyInput.value == '') {
        location.reload();
    }
});

// Sorting listeners
let nameOrder = 0;
let addressOrder = 0;
let emailOrder = 0;
let phoneOrder = 0;
let cityOrder = 0;

sortByName.addEventListener('click', () => {
    if (nameOrder == 0) {
        nameOrder = 1;
    } else if (nameOrder == 1) {
        nameOrder = -1;
    } else if (nameOrder == -1) {
        nameOrder = 1;
    }
    sortCompanyTableByColumn('name', nameOrder);
});

sortByAddress.addEventListener('click', () => {
    if (addressOrder == 0) {
        addressOrder = 1;
    } else if (addressOrder == 1) {
        addressOrder = -1;
    } else if (addressOrder == -1) {
        addressOrder = 1;
    }
    sortCompanyTableByColumn('address', addressOrder);
});

sortByEmail.addEventListener('click', () => {
    if (emailOrder == 0) {
        emailOrder = 1;
    } else if (emailOrder == 1) {
        emailOrder = -1;
    } else if (emailOrder == -1) {
        emailOrder = 1;
    }
    sortCompanyTableByColumn('email', emailOrder);
});

sortByPhone.addEventListener('click', () => {
    if (phoneOrder == 0) {
        phoneOrder = 1;
    } else if (phoneOrder == 1) {
        phoneOrder = -1;
    } else if (phoneOrder == -1) {
        phoneOrder = 1;
    }
    sortCompanyTableByColumn('phone', phoneOrder);
});

sortByCity.addEventListener('click', () => {
    if (cityOrder == 0) {
        cityOrder = 1;
    } else if (cityOrder == 1) {
        cityOrder = -1;
    } else if (cityOrder == -1) {
        cityOrder = 1;
    }
    sortCompanyTableByColumn('city', cityOrder);
});

searchCompanyBtn.addEventListener('click', searchCompany);

async function searchCompany() {
    let searchValue = searchCompanyInput.value.toLowerCase();

    let fetchCompanies = await fetch(`${APP_SERVER}/companies`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let companiesRetrieved = await fetchCompanies.json();
    let companies = companiesRetrieved.companies;

    if (companies) {
        let findCompany = '';

        let nameFound = companies.filter(company => company.name.toLowerCase() == searchValue);
        if (nameFound != '') {
            findCompany = nameFound;
        }
        let addressFound = companies.filter(company => company.address.toLowerCase() == searchValue);
        if (addressFound != '') {
            findCompany = addressFound;
        }
        let emailFound = companies.filter(company => company.email.toLowerCase() == searchValue);
        if (emailFound != '') {
            findCompany = emailFound;
        }
        let phoneFound = companies.filter(company => company.phone.toLowerCase() == searchValue);
        if (phoneFound != '') {
            findCompany = phoneFound;
        }
        let cityFound = companies.filter(company => company.city[0].name.toLowerCase() == searchValue);
        if (cityFound != '') {
            findCompany = cityFound;
        }

        if (findCompany != '') {
            companyTable.innerHTML = '';
            findCompany.forEach(company => {
                createCompanyRow(company.name, company.address, company.email, company.phone, company.city[0].name, company._id);
            });
        } else {
            searchCompanyInput.value = 'No results found';
        }
    }
};

async function fillCities() {
    let fetchCities = await fetch(`${APP_SERVER}/cities`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let allCities = await fetchCities.json();
    let cities = allCities.data;
    // console.log("[DEBUG] Cities: " + cities);

    cities.forEach(city => {
        // console.log("[DEBUG] City: " + city.name);
        let option = document.createElement('option');
        option.innerText = city.name;
        selectCity.appendChild(option);
    });
};

// Sort company table by column
async function sortCompanyTableByColumn(field, order) {
    let fetchSortedCompanies = await fetch(`${APP_SERVER}/companies/sort-by/${field}&${order}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let sortedCompanies = await fetchSortedCompanies.json();
    let companies = sortedCompanies.data;

    companyTable.innerHTML = '';
    companies.forEach(company => {
        createCompanyRow(company.name, company.address, company.email, company.phone, company.city[0].name, company._id);
    });
};

async function getCompanies(params) {
    let fetchCompanies = await fetch(`${APP_SERVER}/companies`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let retrievedCompanies = await fetchCompanies.json();
    let companies = retrievedCompanies.companies;

    for (let i = 0; i < companies.length; i++) {
        let name = companies[i].name;
        let address = companies[i].address;
        let email = companies[i].email;
        let phone = companies[i].phone;
        let city;
        if (companies[i].city[0] == undefined) {
            city = 'No city found';
        } else {
            city = companies[i].city[0].name;
        }
        let companyId = companies[i]._id;
        createCompanyRow(name, address, email, phone, city, companyId);
    }
};

function createCompanyRow(name, address, email, phone, city, companyId) {
    let companyRowDiv = document.createElement('div');
    let nameDiv = document.createElement('div');
    let addressDiv = document.createElement('div');
    let emailDiv = document.createElement('div');
    let phoneDiv = document.createElement('div');
    let cityDiv = document.createElement('div');
    let manageDiv = document.createElement('div');
    let editCompany = document.createElement('i');
    let deleteCompany = document.createElement('i');

    nameDiv.innerText = name;
    addressDiv.innerText = address;
    emailDiv.innerText = email;
    phoneDiv.innerText = phone;
    cityDiv.innerText = city;

    companyRowDiv.className = 'company-row';
    companyRowDiv.id = companyId;
    nameDiv.className = 'company-info';
    addressDiv.className = 'company-info';
    emailDiv.className = 'company-info';
    phoneDiv.className = 'company-info';
    cityDiv.className = 'company-info';

    manageDiv.className = 'company-edit';
    editCompany.className = 'fas fa-user-edit';
    deleteCompany.className = 'fas fa-trash-alt';
    deleteCompany.setAttribute('data-target', '#deleteModal');
    deleteCompany.setAttribute('data-toggle', 'modal');
    editCompany.setAttribute('data-target', '#updateModal');
    editCompany.setAttribute('data-toggle', 'modal');

    companyRowDiv.appendChild(nameDiv);
    companyRowDiv.appendChild(addressDiv);
    companyRowDiv.appendChild(emailDiv);
    companyRowDiv.appendChild(phoneDiv);
    companyRowDiv.appendChild(cityDiv);

    manageDiv.appendChild(editCompany);
    manageDiv.appendChild(deleteCompany);

    companyRowDiv.appendChild(manageDiv);

    companyTable.appendChild(companyRowDiv);

    editCompany.addEventListener('click', (event) => {        
        updateName.value = event.currentTarget.parentNode.parentNode.children[0].innerText;
        updateAddress.value = event.currentTarget.parentNode.parentNode.children[1].innerText;
        updateEmail.value = event.currentTarget.parentNode.parentNode.children[2].innerText;
        updatePhone.value = event.currentTarget.parentNode.parentNode.children[3].innerText;

        selectedCity.innerText = event.currentTarget.parentNode.parentNode.children[4].innerText;

        $('.selectpicker').selectpicker('refresh');

        modalBody[0].id = event.currentTarget.parentNode.parentNode.id;
    });

    deleteCompany.addEventListener('click', (event) => {
        let id = event.currentTarget.parentNode.parentNode.id;
        let name = event.currentTarget.parentNode.parentNode.children[0].innerText;
        modalBody[1].id = id;
        modalBody[1].innerText = `Are you sure that you want to delete: ${name}?`;
    });
};

// Create Company
async function createCompany(event) {
    event.preventDefault();
    try {
        let city = selectCity.value;

        let company = {
            name: companyName.value,
            address: companyAddress.value,
            email: companyEmail.value,
            phone: companyPhone.value
        };

        console.table(company);

        let addCompany = await fetch(`${APP_SERVER}/companies/${city}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(company)
        });

        let companyAdded = await addCompany.json();
        if (companyAdded) {
            addCompanyContainer.style.display = 'none';
            location.reload();
        }
    } catch (error) {
        errors.textContent = error;
    }
};

async function deleteCompany(event) {
    let id = event.currentTarget.parentNode.parentNode.children[1].id;

    // console.log("[DEBUG] Company ID to delete: " + id);
    let fetchCompanyDelete = await fetch(`${APP_SERVER}/companies/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let company = await fetchCompanyDelete.json();
    console.log(company);

    if (company) {
        location.reload();
    } else {
        alert(company.error);
    }
};

async function updateCompany(event) {
    let id = event.currentTarget.parentNode.parentNode.children[1].id;
    let cityName = updateCitySelect.value;
    console.log(id);
    console.log(cityName);
    
    let companyUpdate = {
        name: updateName.value,
        address: updateAddress.value,
        email: updateEmail.value,
        phone: updatePhone.value
    };

    let fetchCompany = await fetch(`${APP_SERVER}/companies/${id}&${cityName}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(companyUpdate)
    });

    let companyUpdated = await fetchCompany.json();

    if (companyUpdated) {
        location.reload();
    } else {
        alert(companyUpdated.error);
    }
    console.log(companyUpdated);
};
