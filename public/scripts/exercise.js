/******************************************************************************
 * 
 * To implement:
 * DONE - Find optimal route to destination with API
 * Create an algorithm to calculate point multipliers
 *          - create time multipler (< 1.0x multipliers if time remaining is negative)
 * DONE - Create a timer for the time remaining (for points)
 * - Save exercise statistics and pathing to database
 * 
 ******************************************************************************/

var deviceType = "Mobile";

var crd = {
    'lat': 0,
    'lng': 0
};
var startPosition = {
    'latitude': 0,
    'longitude': 0
}
var destinationPosition = {
    'latitude': 0,
    'longitude': 0
}

var destinationLat = 0;
var destinationLng = 0;
var dateObj = new Date();
var endTime = new Date();

var routeOption = "off";
var trackingState = false;
var routeError = false;

var positionMarker;
var destinationMarker;
const destination_marker = "images/destination_marker.png";
const location_marker = "images/position_marker.png";
var destinationSet = false;

var timer = 0;
var currentScore = 0;

function startView() {
    var heading = "Map View - ";
    var date = new Date();
    dateObj = date;
    $(".exercise-heading").html(heading.concat(date));
}

function initMap() {
    destinationLat = 0;
    destinationLng = 0;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            updateMap([pos.lat, pos.lng]);
        });
    } else {
        console.log("Unsupported browser.");
    }
}

function initMapView() {
    updateMapView();
}

function updateMap(val) {
    crd = {
        'lat': val[0],
        'lng': val[1]
    };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: parseFloat(crd.lat),
            lng: parseFloat(crd.lng)
        },
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        zoom: 12,
    });

    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: "Click on the map to place your destination pin",
        position: {
            lat: parseFloat(crd.lat),
            lng: parseFloat(crd.lng)
        },
    });
    infoWindow.open(map);

    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();
        // Move destination marker
        if (destinationSet) {
            destinationMarker.setPosition(mapsMouseEvent.latLng);
            destinationMarker.setMap(map);
            destinationMarker.setIcon(destination_marker);
            destinationLat = mapsMouseEvent.latLng.lat();
            destinationLng = mapsMouseEvent.latLng.lng();
            console.log("Destination:", destinationLat, destinationLng);
        } else {
            destinationMarker = new google.maps.Marker({
                position: mapsMouseEvent.latLng,
                map: map,
                icon: destination_marker,
            });
            destinationLat = mapsMouseEvent.latLng.lat();
            destinationLng = mapsMouseEvent.latLng.lng();
            console.log("Destination:", destinationLat, destinationLng);
            destinationSet = true;
        }
    });

    // user's current position pin
    new google.maps.Marker({
        position: {
            lat: parseFloat(crd.lat),
            lng: parseFloat(crd.lng)
        },
        map: map,
        icon: location_marker,
    });
}

function updateMapView() {
    const mapView = new google.maps.Map(document.getElementById("mapView"), {
        center: {
            lat: crd.lat,
            lng: crd.lng
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
            lat: destinationLat,
            lng: destinationLng
        },
        icon: destination_marker,
    });
    destinationMarker.setMap(mapView);

    // user's current position pin
    positionMarker = new google.maps.Marker({
        position: {
            lat: crd.lat,
            lng: crd.lng
        },
        icon: location_marker,
    });
    positionMarker.setMap(mapView);

    // create the optimal route to destination
    if (routeOption == "off") {
        console.log("Route not specified, ignoring request.");
    } else {
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
        directionsDisplay.setMap(map);
        findRoute(directionsService, directionsDisplay);
    };
}

function countTimer() {

}

function setRoute() {
    routeOption = $("input[name=routingOption]:checked").val();
    console.log("Selected Route Option:", routeOption);
}

function findRoute(directionsService, directionsDisplay) {
    var destinationCrd = {
        'lat': destinationLat,
        'lng': destinationLng
    };
    console.log("Location:", crd);
    console.log("Destination:", destinationCrd.lat, destinationCrd.lng);
    directionsService.route({
        origin: crd,
        destination: destinationCrd,
        travelMode: 'WALKING'
    }, function(response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            console.warn('Directions request failed due to ' + status);
            routeError = true;
            $("#completedModal").modal("toggle");
            endExercise();
        }
    });
}

function drawPath() {
    // Create poly lines to create route and append lat and lng to an array for each point to save.
}

function toggleMap() {
    trackingState = true;

    $("#mapView").css("display", "block");
    $("#disclaimer").css("display", "none");
    $(".stop-button").css("display", "block");
    $(".map-line").css("display", "block");
    $(".setup-button").css("display", "none");

    var intervalTimer = window.setInterval(function () {
        if (destinationSet == true) {
            timer = timer + 1;
            updateTime(timer);
        }
    }, 1000);

    // calculate time to destination
    if (destinationSet == true) {
        $(".timer").css("display", "block");
        $(".timeTotal").css("display", "block");

        var origin = new google.maps.LatLng(crd.lat, crd.lng);
        var destination = new google.maps.LatLng(destinationLat, destinationLng);
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: 'WALKING',
                unitSystem: google.maps.UnitSystem.METRIC
            }, response_data);
        function response_data(responseDis, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK || status != "OK") {
                console.warn("Error:", status);
            } else {
                $("#timeGiven").html(responseDis.rows[0].elements[0].duration.text);
            }
        }
    }
    initMapView();
    startView();
}

function updateTime(time) {
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    if (time >= 3600) {
        hours = Math.floor(time / 3600);
        time = time % 3600;
    }
    if (time >= 60) {
        minutes = Math.floor(time / 60);
        time = time % 60;
    }
    seconds = time % 3600;
    if (hours > 0) {
        $("#timeTaken").html(`${hours}h ${minutes}m ${seconds}s`);
    } else if (minutes > 0) {
        $("#timeTaken").html(`${minutes}m ${seconds}s`);
    } else {
        $("#timeTaken").html(`${seconds}s`);
    }
}

function formatDate(endTime) {
    var diff = (dateObj.getTime() - endTime.getTime());
    var seconds = diff / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;

    var secondsF = Math.abs(Math.round(seconds)) % 60;
    var minutesF = Math.abs(Math.round(minutes)) % 60;
    var hoursF = Math.abs(Math.round(hours));

    return `${hoursF}h ${minutesF}m ${secondsF}s`;
}

function checkTime(endTime) {
    var diff = (dateObj.getTime() - endTime.getTime());
    var minutes = diff / 1000 / 60;
    return Math.abs(Math.round(minutes));
}

function scoreMultiplier(distance) {
    // timeMultiplier = Total estimated time to finish divided by total time taken
    // timeMultiplier will be < 1 if total time taken is negative
    const baseMultiplier = 0.5;
    var timeMultiplier = 1.1;
    var bonusScore = totalDistance * baseMultiplier;
    bonusScore *= timeMultiplier;
    return totalDistance + bonusScore;
}

function endExercise() {
    trackingState = false;
    endTime = new Date();

    $("#mapView").css("display", "none");
    $("#disclaimer").css("display", "block");
    $(".timer").css("display", "none");
    $(".timeTotal").css("display", "none");
    $(".stop-button").css("display", "none");
    $(".map-line").css("display", "none");
    $(".setup-button").css("display", "block");
    $(".exercise-heading").html("Exercise Setup");

    if (routeError == true) {
        $("#error-message").html("<h4>An error was detected in routing, this session will not be recorded.</h4><hr />");
    } else if (totalDistance <= 0) {
        $("#error-message").html("<h4>Distance travelled is zero, this session will not be recorded.</h4><hr />");
    } else if (checkTime(endTime) < 5) {
        $("#error-message").html("<h4>Session time is less than 5 minutes, this session will not be recorded.</h4><hr />");
    }

    $("#totalTime").html(formatDate(endTime));
    $("#distanceTravelled").html(`${(totalDistance / 1000).toFixed(2)}km`);
    totalSteps = Math.round(totalDistance * 1.3123);
    $("#estimatedSteps").html(`${totalSteps} steps`);
    totalMinCalories = (totalSteps / 100) * 3;
    if (totalMinCalories == 0) {
        $("#estimatedCalories").html(`${totalMinCalories.toFixed(2)} calories`);
    } else {
        totalMaxCalories = (totalSteps / 100) * 4;
        $("#estimatedCalories").html(`${totalMinCalories.toFixed(2)}-${totalMaxCalories.toFixed(2)} calories`);
    }

    if (routeError == false && totalDistance > 0 && checkTime(endTime) >= 5) {
        userScore = scoreMultiplier(totalDistance);
        writeUserScore();

        // Create a database entry of exercise and then move on to feedback and adjustments
    } else {
        console.warn("Error was detected, database will not be updated.");
    }
}

var totalTime = 0;
var totalDistance = 0;
var totalSteps = 0;
var totalMinCalories = 0;
var totalMaxCalories = 0;
var previousCrd = null;
var options = {
    enableHighAccuracy: true,
    timeout: 7500,
    maximumAge: 0
};

function calcDistance(previousCrd, currentCrd) {
    const R = 6371e3; // metres
    const φ1 = previousCrd.latitude * Math.PI / 180; // φ, λ in radians
    const φ2 = currentCrd.latitude * Math.PI / 180;
    const Δφ = (currentCrd.latitude - previousCrd.latitude) * Math.PI / 180;
    const Δλ = (currentCrd.longitude - previousCrd.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return d = R * c; // in metres
}

function success(pos) {
    var updateCrd = true;
    var crd = pos.coords;
    startPosition = {
        'latitude': crd.latitude,
        'longitude': crd.longitude
    };
    destinationPosition = {
        'latitude': destinationLat,
        'longitude': destinationLng
    };

    if (previousCrd != null) {
        if (crd.accuracy > 20) {
            console.log("Accuracy:", crd.accuracy);
            console.log("Inaccurate, did not take position.");
        } else {
            distance = calcDistance(previousCrd, crd);
            if (trackingState == true) {
                if (distance > 20) {
                    console.log("Updated position");
                    updateMarker(position);
                    totalDistance += distance;
                    console.log("Total Distance:", totalDistance);
                    updateCrd = true;
                } else {
                    console.log("Distance travelled insignificant, ignoring update.");
                    updateCrd = false;
                }
            }
        }
    }
    if (trackingState == true) {
        if (crd.accuracy > 20) {
            console.log("Accuracy:", crd.accuracy);
            console.log("Inaccurate, did not change previous coordinate.");
        } else {
            if (updateCrd == true) {
                previousCrd = pos.coords;
            }
        }
        if (destinationSet) {
            console.log("Distance to destination:", calcDistance(startPosition, destinationPosition));
            if (calcDistance(startPosition, destinationPosition) < 30) {
                console.log("Arrived at destination");
                $("#completedModal").modal("toggle");
                endExercise();
            } 
        }
    }
}

function updateMarker(val) {
    positionMarker.setPosition(val);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

loggedInUser = null;

function retrieveUserScore() {
    var user = firebase.auth().currentUser;
    var score = db.collection("scores").doc(user.uid);
    score.get().then((doc) => {
        if (doc.exists) {
            userScore = parseInt(doc.data()["score"]);
            console.log("Starting Score:", userScore);
        } else {
            // doc.data() will be undefined in this case
            console.warn("No such document!");
        }
    }).catch((error) => {
        console.warn("Error getting document:", error);
    });
}

function writeUserScore(text) {
    var updateScore = db.collection("scores");
    console.log("Current score:", userScore);
    if (loggedInUser == null) {
        console.warn("User is not logged in!");
    } else {
        updateScore.doc(loggedInUser.uid).set({
            score: userScore
        }, {
            merge: true
        })
    }
}

function countTimer(time) {
    timer = time;
}

$("#destinationModal").on('shown.bs.modal', function () {
    initMap();
    google.maps.event.trigger(map, "resize");
});

$(document).ready(function () {
    //main stuff
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedInUser = user;
            retrieveUserScore();
        } else {
            console.warn("No user detected!");
        }
    });

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        deviceType = "Mobile";
        $(".setup-button").css("display", "block");
    } else {
        deviceType = "Desktop";
        $("#desktop-warning").html("Sorry! This application does not work on desktop, please switch to a mobile device.");
        $("#desktop-warning").css("margin-bottom", "20px");
        $(".setup-button").css("display", "none");
    }
    console.log("Device Type:", deviceType);
    if (deviceType == "Mobile") {
        navigator.geolocation.getCurrentPosition(success, error, options);
        var intervalId = window.setInterval(function () {
            if (deviceType == "Mobile") {
                navigator.geolocation.getCurrentPosition(success, error, options);
            } else {
                console.warn("User is not on a mobile device, not running application.");
            }
        }, 7500);
    } else {
        console.warn("User is not on a mobile device, not running application.");
    }
});