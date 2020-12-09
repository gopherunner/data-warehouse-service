const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signInBtn = document.getElementById("login-btn");
const notification = document.getElementById("notification");
let loginHeaders = new Headers();
loginHeaders.append("Content-Type", "application/x-www-form-urlencoded");

const APP_SERVER = "http://127.0.0.1:3000";
const APP_CLIENT = "http://127.0.0.1:5500/project-data-warehouse/frontend";

signInBtn.addEventListener("click", (event) => {
    event.preventDefault();

    let loginUrl = APP_SERVER + '/users/login';
    let bodyEncoded = new URLSearchParams();

    bodyEncoded.append("email", emailInput.value);
    bodyEncoded.append("password", passwordInput.value);

    let requestBody = {
        method: 'POST',
        headers: loginHeaders,
        body: bodyEncoded,
    };

    fetch(loginUrl, requestBody)
        .then(response => {
            if (response.status == 200 || response.status == 201) {
                response.json().then((result) => {
                    let token = result.token;
                    console.log("[DEBUG] => Token: " + token);
                    sessionStorage.setItem("token", token);
                });
                location.href = "home.html";
            } else {
                notification.innerHTML = "Email or password is not valid!";
                console.log("[ERROR] error: " + response.json());
            }
        });
});
