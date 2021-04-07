//logs a user out of our application and returns them to the main page
function logOut() {
    firebase.auth().signOut()
        .then(function () {
            window.location.href = "index.html";
        })
        .catch(function (error) {
            // An error happened
        });
}