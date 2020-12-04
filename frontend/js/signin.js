const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signInBtn = document.getElementById("btn");
const notification = document.getElementById("notification");

const APP_SERVER = "http://127.0.0.1:3000";
const APP_CLIENT = "http://127.0.0.1:5500/project-data-warehouse/frontend";

signInBtn.addEventListener("click", () => {
    signIn();
});

function signIn() {
    console.log("[DEBUG] - User: " + emailInput.value + ", " + passwordInput.value);
    fetch(`${APP_SERVER}/users/login`, {
        method: 'POST',
        body: `{ "email": "${emailInput.value}", "password": "${passwordInput.value}"}`,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if(resp.status == 200) {
            resp.json().then((data) => {
                console.log("[DEBUG] => Token: ", data.token);
                sessionStorage.setItem("token", data.token);
            });
            console.log("[DEBUG] => Login Successfully!");
            location.href = "home.html";
        } else {
            notification.innerHTML = "Email or password is not valid!"
            console.log("[ERROR] error: " + resp.json);
        }
    });
};
