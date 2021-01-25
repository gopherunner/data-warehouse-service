const token = JSON.parse(localStorage.getItem('token'));
const profile = JSON.parse(localStorage.getItem('profile'));

const signOutBtn = document.getElementById("nav-sign-out");

const addUserBtn = document.getElementById('createUser');
const addUserContainer = document.getElementById('newUserContainer');

const userName = document.getElementById('name');
const userLastname = document.getElementById('lastname');
const userEmail = document.getElementById('email');
const userProfile = document.getElementById('profile');
const userPassword = document.getElementById('password');
const passwordEye = document.getElementById('password-eye');
const passwordHelp = document.getElementById('password-help');
passwordHelp.style.display = 'none';
const userConfirmPassword = document.getElementById('confirm-password');
const userSubmitBtn = document.getElementById('btn-user-submit');
const errorMessages = document.getElementById('errors');

// Users table
const usersTable = document.getElementById('users-table');

// User Update
const userFirstnameUpdate = document.getElementById('update-name');
const userLastnameUpdate = document.getElementById('update-lastname');
const userEmailUpdate = document.getElementById('update-email');
const userProfileUpdate = document.getElementById('update-profile');
const modalBody = document.getElementsByClassName('modal-body');
const updateUserBtn = document.getElementById('update-user-btn');

// User Delete
const deleteBtn = document.getElementById('delete-btn');

const APP_SERVER = "http://127.0.0.1:3000";

document.addEventListener('DOMContentLoaded', checkAuthProfile);
document.addEventListener('DOMContentLoaded', getUsers);

async function checkAuthProfile() {
    if (profile == 'user') {
        console.log("[INFO] Unauthorize Access to this resource. You have a " + profile + " profile");
        location.href = "home.html";
    } else {
        return;
    }
};

// Add User listener
addUserBtn.addEventListener('click', (event) => {
    event.preventDefault();

    addUserContainer.style.display = 'flex';
});

// SignOut button
signOutBtn.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.removeItem('token');
    location.href = "index.html";
});

// Password eye listener
passwordEye.addEventListener('click', showPassword);
// Password listener
userPassword.addEventListener('focus', () => {
    passwordHelp.style.display = 'unset';
});
userPassword.addEventListener('blur', () => {
    passwordHelp.style.display = 'none';
});
// Confirm password listener
userConfirmPassword.addEventListener('keyup', checkPassword);

// Create User listener
userSubmitBtn.addEventListener('click', createUser);

// Update User listener
updateUserBtn.addEventListener('click', updateUser);

// Delete User listener
deleteBtn.addEventListener('click', deleteUser);

function showPassword() {
    if (userPassword.type == "password") {
        passwordEye.className = "fas fa-eye";
        userPassword.type = "text";
    } else {
        passwordEye.className = "fas fa-eye-slash";
        userPassword.type = "password";
    }
};

function checkPassword() {
    if (userPassword.value != userConfirmPassword.value) {
        errorMessages.innerText = 'Password dont match!';
        userSubmitBtn.setAttribute('disabled', true);
    } else {
        errorMessages.innerText = '';
        userSubmitBtn.removeAttribute('disabled');
    }
};

async function getUsers(params) {
    
    let fetchUsers = await fetch(`${APP_SERVER}/users`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let allUsers = await fetchUsers.json();
    let users = allUsers.data;

    console.log(users);

    for (let i = 0; i < users.length; i++) {
        let firstname = users[i].firstname;
        let lastname = users[i].lastname;
        let email = users[i].email;
        let profile = users[i].profile;
        let id = users[i]._id;

        renderUserRow(firstname, lastname, email, profile, id);
    }
};

function renderUserRow(firstname, lastname, email, profile, id) {
    let userRow = document.createElement('div');
    let div1 = document.createElement('div');
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');
    let div4 = document.createElement('div');
    let userEdits = document.createElement('div');
    let editUser = document.createElement('i');
    let deleteUser = document.createElement('i');

    userRow.className = 'user-row';
    userRow.id = id;
    div1.className = 'user-info';
    div2.className = 'user-info';
    div3.className = 'user-info';
    div4.className = 'user-info';
    userEdits.className = 'user-edit';
    editUser.className = 'fas fa-user-edit';
    deleteUser.className = 'fas fa-trash-alt';
    deleteUser.setAttribute('data-target','#deleteModal');
    deleteUser.setAttribute('data-toggle','modal');
    editUser.setAttribute('data-target','#updateModal');
    editUser.setAttribute('data-toggle','modal');

    div1.innerText = firstname;
    div2.innerText = lastname;
    div3.innerText = email;
    div4.innerText = profile;

    userRow.appendChild(div1);
    userRow.appendChild(div2);
    userRow.appendChild(div3);
    userRow.appendChild(div4);
    userEdits.appendChild(editUser);
    userEdits.appendChild(deleteUser);
    userRow.appendChild(userEdits);
    usersTable.appendChild(userRow);

    editUser.addEventListener('click', (event) => {
        modalBody[0].id = event.currentTarget.parentNode.parentNode.id;
        userFirstnameUpdate.value = event.currentTarget.parentNode.parentNode.children[0].innerText;
        userLastnameUpdate.value = event.currentTarget.parentNode.parentNode.children[1].innerText;
        userEmailUpdate.value = event.currentTarget.parentNode.parentNode.children[2].innerText;
        userProfileUpdate.value = event.currentTarget.parentNode.parentNode.children[3].innerText.toLowerCase();
    });

    deleteUser.addEventListener('click', (event) => {
        let id = event.currentTarget.parentNode.parentNode.id;
        let firstname = event.currentTarget.parentNode.parentNode.children[0].innerText;
        modalBody[1].id = id;
        modalBody[1].innerText = `Are you sure that you want to delete? User: ${firstname}`;
    });
};

async function createUser(event) {
    event.preventDefault();

    try {
        let user = {
            name: userName.value,
            lastname: userLastname.value,
            email: userEmail.value,
            profile: userProfile.value,
            password: userPassword.value
        };
    
        let userCreate = await fetch(`${APP_SERVER}/users/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(user)
        });
    
        let userCreated = await userCreate.json();
    
        if (userCreated) {
            addUserContainer.style.display = 'none';
            location.reload();
        }
    } catch (error) {
        errorMessages.textContent = error;
    }
};

async function updateUser(event) {
    let userId = event.currentTarget.parentNode.parentNode.children[1].id;

    let userUpdate = {
        name: userFirstnameUpdate.value,
        lastname: userLastnameUpdate.value,
        email: userEmailUpdate.value,
        profile: userProfileUpdate.value
    };
    // console.log("[DEBUG] User ID to modify: " + userId);

    let fetchUserUpdate = await fetch(`${APP_SERVER}/users/${userId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userUpdate)
    });

    let userUpdated = await fetchUserUpdate.json();

    if (!userUpdated.error) {
        location.reload();
    } else {
        alert(userUpdated.error);
    }
};

async function deleteUser(event) {
    let userId = event.currentTarget.parentNode.parentNode.children[1].id;

    let fetchUserDelete = await fetch(`${APP_SERVER}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let userDeleted = await fetchUserDelete.json();
    if (!userDeleted.error) {
        location.reload();
    } else {
        alert(userDeleted.error);
    }
};
