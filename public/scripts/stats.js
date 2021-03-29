var loggedInUser = null;

function openReview(id) {
    var sessionDate;
    var time;
    var distance;
    var steps;
    var minCalories;
    var maxCalories;

    db.collection("user").doc(loggedInUser.uid).collection("sessions").doc(id)
    .get().then((doc) => {
        if (doc.exists) {
            sessionDate = (doc.data().date).toDate();
            time = doc.data().totalTime;
            distance = doc.data().distanceTravelled;
            steps = doc.data().stepsTaken;
            minCalories = doc.data().minCaloriesBurned;
            maxCalories = doc.data().maxCaloriesBurned;
            $("#dateLabel").html(sessionDate);
            $("#totalTime").html(time);
            $("#distanceTravelled").html(`${distance}km`);
            $("#estimatedSteps").html(`${steps} steps`);
            $("#estimatedCalories").html(`${minCalories}-${maxCalories} calories`);
        } else {
            // doc.data() will be undefined in this case
            console.warn("No such document!");
        }
    }).catch((error) => {
        console.warn("Error getting document:", error);
    });
    $("#reviewModal").modal("toggle");
}

function addEventListeners() {
    var entries = document.querySelectorAll(".entries");

    for (var i = 0; i < entries.length; i++) {
        entries[i].addEventListener('click', openReview(this.id), false);
    }
}

function displaySessions() {
    var list = document.getElementById("list-entries");
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
                newdom.setAttribute("class", "list-group-item entry-color entries result-hover");
                newdom.addEventListener('click', function() {openReview(id)});
                list.appendChild(newdom);
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
            // addEventListeners();
        } else {
            console.warn("No user detected!");
            window.location.href = "login.html";
        }
    });
});