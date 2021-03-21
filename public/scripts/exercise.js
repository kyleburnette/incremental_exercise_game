var crd = {
    'lat': 0,
    'lng': 0
};

var destinationLat = 0;
var destinationLng = 0;
var dateObj;

var routeOption = "off";
var trackingState = false;

function startView() {
    var heading = "Map View - ";
    var date = getDate();
    $(".exercise-heading").html(heading.concat(date));
}

function getDate() {
    dateObj = new Date().toLocaleString('en-CA', {timeZone: "America/Vancouver"});
    return dateObj;
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
        zoom: 15,
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
    new google.maps.Marker({
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
}

function toggleMap() {
    $("#mapView").css("display", "block");
    initMapView();
    trackingState = true;
    $(".stop-button").css("display", "block");
    $(".map-line").css("display", "block");
    $(".setup-button").css("display", "none");
    startView();
}

function endExercise() {
    $("#mapView").css("display", "none");
    $(".stop-button").css("display", "none");
    $(".map-line").css("display", "none");
    $(".exercise-heading").html("Exercise Setup");
    $(".setup-button").css("display", "block");
}

var totalDistance = 0;
var previousCrd = null;
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
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
    var crd = pos.coords;
    if (previousCrd != null) {
        distance = calcDistance(previousCrd, crd);
        console.log(distance);
        /*
        document.getElementById("test").innerHTML = `Latitude: ${crd.latitude}` +
            `<br/>Longitude: ${crd.longitude}` + `<br/>Accuracy: ${crd.accuracy} meters.` +
            `<br/>Distance from last measurement: ${distance} meters`;
        */
    }
    previousCrd = pos.coords;
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

var intervalId = window.setInterval(function () {
    navigator.geolocation.getCurrentPosition(success, error, options);
}, 5000);

$("#destinationModal").on('shown.bs.modal', function () {
    initMap();
    google.maps.event.trigger(map, "resize");
});