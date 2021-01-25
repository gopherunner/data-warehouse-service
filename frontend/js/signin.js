const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signInBtn = document.getElementById("login-btn");
const notification = document.getElementById("notification");
let loginHeaders = new Headers();
loginHeaders.append("Content-Type", "application/x-www-form-urlencoded");

const APP_SERVER = "http://localhost:3000";

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
                    let profile = result.profile;

                    if (token !== undefined) {
                        console.log("[DEBUG] => Token: " + token);
                        sessionStorage.setItem("token", JSON.stringify(token));
                        localStorage.setItem("token", JSON.stringify(token));
                        sessionStorage.setItem("profile", JSON.stringify(profile));
                        localStorage.setItem("profile", JSON.stringify(profile));
                        location.href = "home.html";
                    } else {
                        notification.innerHTML = "Email or password is not valid!";
                        emailInput.value = '';
                        passwordInput.value = '';
                    }
                });
            } else {
                notification.innerHTML = "Email or password is not valid!";
                console.log("[ERROR] error: " + response.json());
                emailInput.value = '';
                passwordInput.value = '';
            }
        });
});
