function logOut() {
    firebase.auth().signOut()
        .then(function () {
            window.location.href = "index.html";
        })
        .catch(function (error) {
            // An error happened
        });
}