const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const signOutBtn = document.getElementById("nav-sign-out");

// Region main container
const regionContainer = document.getElementById('region-container');

const userNavItem = document.getElementById('user-nav-item');

// Create modal
const createTitle = document.getElementById('createModalTitle');
const createText = document.getElementById('create-text');
const createBtn = document.getElementById('create-btn')
const createModalBody = document.getElementById('create-modal-body');
let modalCreate = document.getElementsByClassName('modal')[2];

// Update modal
const updateTitle = document.getElementById('updateModalTitle');
const updateText = document.getElementById('update-text');
const updateBtn = document.getElementById('update-btn');
const updateModalBody = document.getElementById('update-modal-body');
let modalUpdate = document.getElementsByClassName('modal')[1];

// Delete modal
const deleteTitle = document.getElementById('deleteModalTitle');
const deleteBtn = document.getElementById('delete-btn');
const modalBody = document.getElementById('modal-body');
let modalDelete = document.getElementsByClassName('modal')[0];

// Create new Region elements
const inputRegion = document.getElementById('inputRegion');
const submitRegion = document.getElementById('submitRegion');
const regionErrors = document.getElementById('region-errors');

// Tree errors
const treeAlert = document.getElementById('tree-alert');
const treeAlertText = document.getElementById('tree-alert-text');
const notification = document.getElementById('notification');

treeAlert.style.display = 'none';

const APP_SERVER = "http://127.0.0.1:3000";

// Listeners
document.addEventListener('DOMContentLoaded', checkAuthProfile);
document.addEventListener('DOMContentLoaded',getRegions);
createBtn.addEventListener('click',createLocation);
submitRegion.addEventListener('click',createRegion);
updateBtn.addEventListener('click',updateLocation);
deleteBtn.addEventListener('click',deleteLocation);

// SignOut button
signOutBtn.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.removeItem('token');
    location.href = "index.html";
});

inputRegion.addEventListener('focus', () => {
    notification.innerHTML = '';
});

// Check Auth Profile listener
async function checkAuthProfile() {
    if (profile == 'user') {
        userNavItem.remove();
    }
    if (token === null) {
        location.href = "index.html";
    }
};

// Get all Regions
async function getRegions(params) {

    let fetchRegions = await fetch(`${APP_SERVER}/regions`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let allRegions = await fetchRegions.json();
    let regions = allRegions.data;

    // console.log("[DEBUG] => regions: " + regions);

    regionContainer.innerHTML = '';
    // For each region lets create the tree dynamically region > country > city
    for (let i=0; i < regions.length; i++) {
        let region = regions[i];
        createRegionUl(region);
    }
};

function createRegionUl(region){
    let regionName = region.name;

    let regionId = region._id;

    let ulRegion = document.createElement('ul');
    ulRegion.className = 'ul-region';
    ulRegion.title = regionName;
    ulRegion.id = regionId;


    let divRegion = document.createElement('div');
    divRegion.className = 'region-div';
    divRegion.id = regionName;


    let pRegion = document.createElement('p');
    pRegion.textContent = regionName;
    pRegion.addEventListener('click',(event) => {
        let regionElements = event.currentTarget.parentNode.parentNode.children;
        toggleSelection(regionElements);
    });

    let ellipsisElement = document.createElement('i');
    ellipsisElement.className = 'fas fa-ellipsis-v';

    let updateRegion = document.createElement('i');
    updateRegion.className = 'fas fa-edit hidden';
    updateRegion.title = 'Edit the name of the Region';
    updateRegion.setAttribute('data-target','#updateModal');
    updateRegion.setAttribute('data-toggle','modal');

    updateRegion.addEventListener('click', () => {
        updateTitle.textContent = 'Update Region';
        updateModalBody.id = regionId;
        updateModalBody.title = 'regions';
        
    });

    let deleteRegion = document.createElement('i');
    deleteRegion.className = 'fas fa-trash-alt hidden';
    deleteRegion.title = 'Delete Region';
    deleteRegion.setAttribute('data-target','#deleteModal');
    deleteRegion.setAttribute('data-toggle','modal');

    // Delete region listener
    deleteRegion.addEventListener('click', () => {
        deleteTitle.textContent = 'Delete Region';
        modalBody.id = regionId;
        modalBody.title = 'regions';
        modalBody.innerText = `Are you sure that you want to delete Region: ${regionName}?`;
    });

    let addCountry = document.createElement('i');
    addCountry.title = 'Add Country to Region';
    addCountry.className = 'fas fa-plus-circle hidden';
    addCountry.setAttribute('data-target','#createModal');
    addCountry.setAttribute('data-toggle','modal');

    // Create country listener
    addCountry.addEventListener('click', ()=>{
        createTitle.textContent = 'Create new Country';
        createModalBody.id = regionId;
        createModalBody.title = 'countries';
        createText.setAttribute('placeholder', 'Enter the name of the Country');
    });

    ellipsisElement.addEventListener('click', () => {
        showIcons(updateRegion, deleteRegion, addCountry);
    });

    let countries = region.countries;

    divRegion.appendChild(pRegion);
    divRegion.appendChild(ellipsisElement);
    divRegion.appendChild(deleteRegion);
    divRegion.appendChild(updateRegion);
    divRegion.appendChild(addCountry);
    ulRegion.appendChild(divRegion);

    // Add the region to the region main container
    regionContainer.appendChild(ulRegion)

    // Create the <ul> of each country with the corresponding cities
    for(let a = 0; a< countries.length; a++){        
        let countryName = countries[a].name;
        let countryId = countries[a]._id;

        let ulCountry = document.createElement('ul');
        ulCountry.className = 'ul-country';
        ulCountry.title = countryName;
        ulCountry.id = countryId;

        let divCountry = document.createElement('div');
        divCountry.className = 'country-div';

        let pCountry = document.createElement('p');
        pCountry.textContent = countryName;
        pCountry.addEventListener('click',(event)=>{
            let regionElements = event.currentTarget.parentNode.parentNode.children;
            toggleSelection(regionElements);
        });
        let ellipsisElementCountry = document.createElement('i');
        ellipsisElementCountry.className = 'fas fa-ellipsis-v';

        let deleteCountry = document.createElement('i');
        deleteCountry.title = 'Delete Country';
        deleteCountry.setAttribute('data-target','#deleteModal');
        deleteCountry.setAttribute('data-toggle','modal');

        // Delete country listener
        deleteCountry.addEventListener('click', () => {
            deleteTitle.textContent = 'Delete Country';
            modalBody.id = countryId;
            modalBody.title = 'countries';
            modalBody.innerText = `Are you sure that you want to delete Country: ${countryName}?`;
        });

        let updateCountry = document.createElement('i');
        updateCountry.title = 'Edit the name of the Country';
        updateCountry.setAttribute('data-target','#updateModal');
        updateCountry.setAttribute('data-toggle','modal');

        updateCountry.addEventListener('click', () => {
            updateTitle.textContent = 'Update Country';
            updateModalBody.id = countryId;
            updateModalBody.title = 'countries';
        });

        let addCity = document.createElement('i');
        addCity.title = 'Add City to Country';
        addCity.className = 'fas fa-plus-circle hidden';
        addCity.setAttribute('data-target','#createModal');
        addCity.setAttribute('data-toggle','modal');
    
        // Add City listener
        addCity.addEventListener('click', () => {
            createTitle.textContent = 'Add New City';
            createModalBody.id = countryId;
            createModalBody.title = 'cities';
            createText.setAttribute('placeholder', 'Enter the name of the City');
        });

        deleteCountry.className = 'fas fa-trash-alt hidden';
        updateCountry.className = 'fas fa-edit hidden';

        ellipsisElementCountry.addEventListener('click', () => {
            showIcons(updateCountry, deleteCountry, addCity);
        });

        divCountry.appendChild(pCountry);
        divCountry.appendChild(ellipsisElementCountry);
        divCountry.appendChild(deleteCountry);
        divCountry.appendChild(updateCountry);
        divCountry.appendChild(addCity);
        ulCountry.appendChild(divCountry);

        // Add country to region
        ulRegion.appendChild(ulCountry)

        let cities = countries[a].cities;
        for(let b = 0; b < cities.length; b++){

            let cityName = cities[b].name;
            let cityId = cities[b]._id;

            let cityDiv = document.createElement('div');
            cityDiv.className = 'city-div';

            let cityLi = document.createElement('li');
            cityLi.className = 'li-city';
            cityLi.id = cityId;
            cityLi.textContent = cityName;

            let ellipsisElementCity = document.createElement('i');
            ellipsisElementCity.className = 'fas fa-ellipsis-v';


            let deleteCity = document.createElement('i');
            deleteCity.title = 'Delete City';
            deleteCity.setAttribute('data-target','#deleteModal');
            deleteCity.setAttribute('data-toggle','modal');
            deleteCity.addEventListener('click', () => {
                deleteTitle.textContent = 'Delete City';
                modalBody.id = cityId;
                modalBody.title = 'cities';
                modalBody.innerText = `Are you sure that you want to delete City: ${cityName}?`;
            });


            let updateCity = document.createElement('i');
            updateCity.title = 'Edit the name of the City';
            updateCity.setAttribute('data-target','#updateModal');
            updateCity.setAttribute('data-toggle','modal');
            updateCity.addEventListener('click', () => {
                updateTitle.textContent = 'Update City';
                updateModalBody.id = cityId;
                updateModalBody.title = 'cities';
                updateText.value = '';
            });

            deleteCity.className = 'fas fa-trash-alt hidden';
            updateCity.className = 'fas fa-edit hidden';
            
            ellipsisElementCity.addEventListener('click', () => {
                showIcons(updateCity, deleteCity);
            });

            cityLi.appendChild(ellipsisElementCity);
            cityLi.appendChild(deleteCity);
            cityLi.appendChild(updateCity);
            cityDiv.appendChild(cityLi);

            // Add city to the corresponding country
            ulCountry.appendChild(cityDiv);
        }
    }
}

function toggleSelection(elements) {
    for (let i = 0; i < elements.length; i++) {
        if (!elements[i].classList.contains('hidden')) {
            elements[i].classList.add("hidden");
        } else {
            elements[i].classList.remove("hidden");
        }
    }
};

async function deleteLocation(event) {
    let id = event.currentTarget.parentNode.parentNode.children[1].id;
    let deleteLocation = event.currentTarget.parentNode.parentNode.children[1].title;
    
    try {
        let locationDeleted = await fetch(`${APP_SERVER}/${deleteLocation}/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
    
        let locationData = await locationDeleted.json();
        
        if(locationData.error){
            console.log("[ERROR] While trying to delete the " + deleteLocation + " with Id: " + id);
            treeAlert.style.display = 'unset';
            treeAlertText.textContent = 'Invalid field!';
        }else{
            const element = document.getElementById(id);
            // Add fall effect
            element.classList.add("fall");   
            // When transition finish then remove it
            element.addEventListener('transitionend', () => {
                element.remove();
            })
        }
    } catch (error){
        console.log("[ERROR] While trying to delete the " + deleteLocation + " with Id: " + id);
        alert(e);
    }
};

async function updateLocation(event) {
    let id = event.currentTarget.parentNode.parentNode.children[1].id;
    let updateLocation = event.currentTarget.parentNode.parentNode.children[1].title;
    let location = updateText.value;

    let locationToUpdate = {
        name: location
    };

    try {

        let locationUpdated = await fetch(`${APP_SERVER}/${updateLocation}/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(locationToUpdate)
        });
    
        let locationData = await locationUpdated.json();

        if(locationData.error){
            treeAlert.style.display = 'unset';
            treeAlertText.textContent = 'Invalid field!';
        }else{
            getRegions();
        }
    } catch(error){
        console.log(error);
        alert(error);
    }
};

async function createLocation(event){
    let id = event.currentTarget.parentNode.parentNode.children[1].id;
    let createLocation = event.currentTarget.parentNode.parentNode.children[1].title;
    let location = createText.value;

    let locationToCreate = {
        name: location
    };

    try {
        let locationCreated = await fetch(`${APP_SERVER}/${createLocation}/${id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(locationToCreate)
        });
    
        let locationData = await locationCreated.json();

        if(locationData.error){
            treeAlert.style.display = 'unset';
            treeAlertText.textContent = 'Invalid field!';
        }else{
            getRegions();
        }
    } catch(error){
        console.log(error);
        alert(error);
    }
};

function showIcons(editIcon, deleteIcon, createIcon) {
    if (createIcon) {
        if (editIcon.classList.contains('hidden') & deleteIcon.classList.contains('hidden') & createIcon.classList.contains('hidden')) {
            editIcon.classList.remove('hidden');
            deleteIcon.classList.remove('hidden');
            createIcon.classList.remove('hidden');
        } else {
            editIcon.classList.add('hidden');
            deleteIcon.classList.add('hidden');
            createIcon.classList.add('hidden');
        }
    } else {
        if (editIcon.classList.contains('hidden') & deleteIcon.classList.contains('hidden')) {
            editIcon.classList.remove('hidden');
            deleteIcon.classList.remove('hidden');
        } else {
            editIcon.classList.add('hidden');
            deleteIcon.classList.add('hidden');
        }
    }
};

async function createRegion() {
    let newRegion = inputRegion.value;

    if (newRegion != '') {
        let region = {
            name: newRegion
        };

        try {
            let createRegion = await fetch(`${APP_SERVER}/regions`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(region)
            });
            let regionCreated = await createRegion.json();

            if (regionCreated.error) {
                // console.log(regionCreated);
                treeAlert.style.display = 'unset';
                treeAlertText.textContent = 'Invalid field!';
            } else {
                getRegions();
            }
        } catch (error) {
            console.log(error);
            alert(e);
        }
    } else {
        notification.innerHTML = "The region can't be empty"
    }
};
