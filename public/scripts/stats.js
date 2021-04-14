// Update map to show when modal is opened
$("#mapModal").on('shown.bs.modal', function () {
    initMapView();
    google.maps.event.trigger(map, "resize");
});

// Create the map
function initMapView() {
    updateMapView();
}

// Set the destination marker for map view
function setDestinationMarker() {
    destinationMarker = new google.maps.Marker({
        position: {
            lat: destinationPosition.latitude,
            lng: destinationPosition.longitude
        },
        icon: destination_marker,
    });
}

// Set the position marker for map view
function setPositionMarker() {
    positionMarker = new google.maps.Marker({
        position: {
            lat: startPosition.latitude,
            lng: startPosition.longitude
        },
        icon: location_marker,
    });
}

// Set the user path for map view
function drawUserPath() {
    userPath = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: "#93E62E",
        strokeOpacity: 0.7,
        strokeWeight: 6,
    });
}

// Create all the map elements
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
    // Set the destination marker on map
    setDestinationMarker();
    destinationMarker.setMap(mapView);
    // Set the user's start position on map
    setPositionMarker();
    positionMarker.setMap(mapView);
    // Draw path taken by user on map
    drawUserPath();
    userPath.setMap(mapView);
}

/********************************************************************
 * Retrieve statistics from the passed document
 * doc - Selected document from firestore
 ********************************************************************/
function getStats(doc) {
    startPosition = doc.data().startPosition;
    destinationPosition = doc.data().destinationPosition;
    pathCoordinates = doc.data().path;
    sessionDate = (doc.data().date).toDate();
    time = doc.data().totalTime;
    distance = doc.data().distanceTravelled;
    steps = doc.data().stepsTaken;
    minCalories = doc.data().minCaloriesBurned;
    maxCalories = doc.data().maxCaloriesBurned;
}

// Set statistics in modal
function setModalStats() {
    $("#dateLabel").html(sessionDate);
    $("#totalTime").html(time);
    $("#distanceTravelled").html(`${distance}km`);
    $("#estimatedSteps").html(`${steps} steps`);
    $("#estimatedCalories").html(`${minCalories}-${maxCalories} calories`);
}

/********************************************************************
 * Update statistics in modal from database when an entry is selected
 * id - Current document ID from html
 ********************************************************************/
function openReview(id) {
    currentID = id;

    db.collection("user").doc(loggedInUser.uid).collection("sessions").doc(id)
    .get().then((doc) => {
        if (doc.exists) {
            getStats(doc);
            setModalStats();
        } else {
            // doc.data() will be undefined in this case
            console.warn("No such document!");
        }
    }).catch((error) => {
        console.warn("Error getting document:", error);
    });
    $("#reviewModal").modal("toggle");
}

/********************************************************************
 * Create entry element for the list
 * doc - Selected document from firestore
 * list - Session entry DOM element
 ********************************************************************/
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

// Display 5 recent sessions in a list
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
            displaySessions();
        } else {
            console.warn("No user detected!");
            window.location.href = "login.html";
        }
    });
});