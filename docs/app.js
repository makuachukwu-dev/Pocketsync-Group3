
// splash scren
if (
    window.location.pathname === "/" ||
    window.location.pathname.includes("index.html")
) {

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



//log in page password toggle
const passwordInput = document.getElementById("password");
const togglePassword = document.querySelector(".toggle-password");

if (passwordInput && togglePassword) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "Hide";
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "Show";
        }

    });

}

//validation for login
//validation for login

const loginForm = document.querySelector(".login-form");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();

        const savedEmail =
            localStorage.getItem("email");

        const savedPassword =
            localStorage.getItem("password");

        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        if (
            email === savedEmail &&
            password === savedPassword
        ) {

            window.location.href =
                "dashboard-empty.html";

        } else {

            alert("Invalid email or password.");

        }

    });

}
// funtion to go to istitution selection page
function goToInstitutionSelection() {
    window.location.href = "institution-selection.html";
}

//functio for insti. selection
function selectInstitution(bankName, logoPath) {

    localStorage.setItem("selectedBank", bankName);
    localStorage.setItem("selectedBankLogo", logoPath);

    window.location.href = "institution-login.html";
}

document.addEventListener("DOMContentLoaded", () => {

    const bankLogo = document.getElementById("bankLogo");

    const selectedLogo =
        localStorage.getItem("selectedBankLogo");

    if (bankLogo && selectedLogo) {
        bankLogo.src = selectedLogo;
    }

});

function connectAccount() {

    const accountNumber =
        document.getElementById("accountNumber").value.trim();

    const password =
        document.getElementById("bankPassword").value.trim();

    if (accountNumber === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    window.location.href = "permissions-consent.html";
}

// Permissions and Consent

const consentCheck = document.getElementById("consentCheck");
const continueBtn = document.getElementById("continueBtn");

if (consentCheck && continueBtn) {

    continueBtn.disabled = true;
    continueBtn.style.opacity = "0.5";

    consentCheck.addEventListener("change", () => {

        if (consentCheck.checked) {
            continueBtn.disabled = false;
            continueBtn.style.opacity = "1";
        } else {
            continueBtn.disabled = true;
            continueBtn.style.opacity = "0.5";
        }

    });

}


function continueToDashboard() {

    if (!consentCheck.checked) {
        return;
    }

    window.location.href = "account-success.html";
}

//signup functionality 

const signupForm = document.querySelector(".signup-form");

if (signupForm) {

    signupForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const firstName =
            document.getElementById("firstName").value.trim();

        const lastName =
            document.getElementById("lastName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value.trim();

        const confirmPassword =
            document.getElementById("confirmPassword").value.trim();

        if (
            firstName === "" ||
            lastName === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        window.location.href = "login.html";

    });

}

//dashboard greeting

document.addEventListener("DOMContentLoaded", () => {

    const greeting =
        document.getElementById("userGreeting");

    if (greeting) {

        const firstName =
            localStorage.getItem("firstName");

        if (firstName) {

            greeting.innerHTML =
                `Hello, ${firstName} 👋`;

        }

    }

});

function dashboardComingSoon() {
    alert("Dashboard coming soon.");
}
