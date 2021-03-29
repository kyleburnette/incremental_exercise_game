var loggedInUser = null;

function displaySessions() {
    if (loggedInUser != null) {
        db.collection("user").doc(loggedInUser.uid).collection("sessions")
        .limit(5)
        .orderBy("date", "desc")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var id = doc.id;
                var date = (doc.data().date).toDate();
                var newdom = document.createElement("li");
                newdom.id = id;
                newdom.innerHTML = date;
                $(id).attr("class", "list-group-item entry-color");
                $("#list-entries").append(newdom);
            })
        })
    } else {
        console.warn("User is not logged in!");
        window.location.href = "login.html";
    }
}

$(document).ready(function () {
    //main stuff
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedInUser = user;
            console.log("Logged in as", loggedInUser.displayName);
            displaySessions();
        } else {
            console.warn("No user detected!");
            window.location.href = "login.html";
        }
    });
});