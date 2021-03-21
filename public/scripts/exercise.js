/******************************************************************************
 * 
 * To implement:
 * - Find optimal route to destination with API
 * - Create an algorithm to calculate point multipliers for time remaining,
 *      - < 1.0x multipliers if time remaining is negative
 * - Create a timer for the time remaining (for points)
 * - Save exercise statistics and pathing to database
 * 
 ******************************************************************************/

var deviceType = "Mobile";

var crd = {
    'lat': 0,
    'lng': 0
};

var destinationLat = 0;
var destinationLng = 0;
var dateObj = new Date();
var endTime = new Date();

var routeOption = "off";
var trackingState = false;

var positionMarker;

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
    const destination_marker = "images/destination_marker.png";
    const location_marker = "images/position_marker.png";
    let destinationSet = false;
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
            destinationLat = mapsMouseEvent.latLng.lat();
            destinationLng = mapsMouseEvent.latLng.lng();
            console.log("Destination:", destinationLat, destinationLng);
        } else {
            destinationMarker = new google.maps.Marker({
                position: mapsMouseEvent.latLng,
                map,
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
        map,
        icon: location_marker,
    });
}

function updateMapView() {
    const destination_marker = "images/destination_marker.png";
    const location_marker = "images/position_marker.png";
    const map = new google.maps.Map(document.getElementById("mapView"), {
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
        map,
        icon: destination_marker,
    });

    // user's current position pin
    positionMarker = new google.maps.Marker({
        position: {
            lat: crd.lat,
            lng: crd.lng
        },
        map,
        icon: location_marker,
    });

    // create the optimal route to destination
    if (routeOption == "off") {
        console.log("Route not specified, ignoring request.");
    } else {
        findRoute(destinationLat, destinationLng);
    };
}

function setRoute() {
    routeOption = $("input[name=routingOption]:checked").val();
    console.log("Selected Route Option:", routeOption);
}

function findRoute(lat, lng) {
    console.log("Location:", crd)
    console.log("Destination:", lat, lng);
    // Use Google API to find the shortest route
}

function drawPath() {
    // Create poly lines to create route and append lat and lng to an array for each point to save.
}

function toggleMap() {
    trackingState = true;
    $("#mapView").css("display", "block");
    $("#disclaimer").css("display", "none");
    initMapView();
    $(".stop-button").css("display", "block");
    $(".map-line").css("display", "block");
    $(".setup-button").css("display", "none");
    startView();
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

function endExercise() {
    trackingState = false;
    $("#mapView").css("display", "none");
    $(".stop-button").css("display", "none");
    $(".map-line").css("display", "none");
    $(".setup-button").css("display", "block");
    $(".exercise-heading").html("Exercise Setup");
    $("#disclaimer").css("display", "block");
    endTime = new Date();
    $("#totalTime").html(formatDate(endTime));
    $("#distanceTravelled").html(`${(totalDistance / 1000).toFixed(2)}km`);
    totalSteps = Math.round(totalDistance * 1.3123);
    $("#estimatedSteps").html(`${totalSteps} steps`);
    totalMinCalories = (totalSteps / 100) * 3;
    if (totalMinCalories == 0) {
        $("#estimatedCalories").html(`${totalMinCalories} calories`);
    } else {
        totalMaxCalories = (totalSteps / 100) * 4;
        $("#estimatedCalories").html(`${totalMinCalories}-${totalMaxCalories} calories`);
    }
    // Create a database entry of exercise and then move on to feedback and adjustments
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
    var position = {
        'lat': crd.latitude,
        'lng': crd.longitude
    }

    if (previousCrd != null) {
        if (crd.accuracy > 25) {
            console.log("Accuracy:", crd.accuracy);
            console.log("Inaccurate, did not take position.");
        } else {
            distance = calcDistance(previousCrd, crd);
            if (trackingState == true) {
                if (distance > 10) {
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
            /*
            document.getElementById("test").innerHTML = `Latitude: ${crd.latitude}` +
                `<br/>Longitude: ${crd.longitude}` + `<br/>Accuracy: ${crd.accuracy} meters.` +
                `<br/>Distance from last measurement: ${distance} meters`;
            */
        }
    }
    if (crd.accuracy > 25) {
        console.log("Accuracy:", crd.accuracy);
        console.log("Inaccurate, did not change previous coordinate.");
    } else {
        if (updateCrd == true) {
            previousCrd = pos.coords;
            console.log("New coordinate:", previousCrd);
        }
    }
}

function updateMarker(val) {
    positionMarker.setPosition(val);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

$("#destinationModal").on('shown.bs.modal', function () {
    initMap();
    google.maps.event.trigger(map, "resize");
});

$(document).ready(function() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
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