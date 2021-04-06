var loggedInUser = null;
var currentID;

var startPosition = {
    'latitude': 0,
    'longitude': 0
}
var destinationPosition = {
    'latitude': 0,
    'longitude': 0
}

var positionMarker;
var destinationMarker;
const destination_marker = "images/destination_marker.png";
const location_marker = "images/position_marker.png";
var userPath;
var pathCoordinates = [];

$("#mapModal").on('shown.bs.modal', function () {
    initMapView();
    google.maps.event.trigger(map, "resize");
});

function initMapView() {
    updateMapView();
}

function updateMapView() {
    const mapView = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: startPosition.latitude,
            lng: startPosition.longitude
        },
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        zoom: 12,
    });

    destinationMarker = new google.maps.Marker({
        position: {
            lat: destinationPosition.latitude,
            lng: destinationPosition.longitude
        },
        icon: destination_marker,
    });
    destinationMarker.setMap(mapView);

    // user's current position pin
    positionMarker = new google.maps.Marker({
        position: {
            lat: startPosition.latitude,
            lng: startPosition.longitude
        },
        icon: location_marker,
    });
    positionMarker.setMap(mapView);

    // draw path taken by user
    userPath = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: "#93E62E",
        strokeOpacity: 0.7,
        strokeWeight: 6,
      });
    userPath.setMap(mapView);
}

function openReview(id) {
    currentID = id;
    var sessionDate;
    var time;
    var distance;
    var steps;
    var minCalories;
    var maxCalories;

    db.collection("user").doc(loggedInUser.uid).collection("sessions").doc(id)
    .get().then((doc) => {
        if (doc.exists) {
            startPosition = doc.data().startPosition;
            destinationPosition = doc.data().destinationPosition;
            pathCoordinates = doc.data().path;
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

function createEntry(doc, list) {
    var id = doc.id;
    var date = (doc.data().date).toDate();
    var newdom = document.createElement("li");
    newdom.id = id;
    newdom.innerHTML = date;
    newdom.setAttribute("class", "list-group-item entry-color entries result-hover");
    newdom.addEventListener('click', function() {openReview(id)});
    list.appendChild(newdom);
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
                createEntry(doc, list);
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