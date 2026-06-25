
// splash scren
if (window.location.pathname.includes("index.html")) {

    setTimeout(() => {
        window.location.href = "onboarding-1.html";
    }, 3000);

}
//onboarding flow
function goNext() {
     window.location.href = "onboarding-2.html";
}

function goToOnboarding3() {
     window.location.href = "onboarding-3.html";
}

function goToSignup() {
    window.location.href = "signup.html";
}



//log in page
const passwordInput = document.getElementById("password");
const togglePassword = document.querySelector(".toggle-password");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }

});

//validation for login
const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    alert("Login successful!");

});