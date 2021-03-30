$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedInUser = user;
            console.log("Logged in as", loggedInUser.displayName,
                "and will redirecting to home.");
            window.location.href = "main.html";
        } else {
            console.log("No user is logged in.");
        }
    });
})