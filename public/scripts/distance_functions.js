const pollRate = 5000;

var previousCrd = null;
var distanceTraveledThisCycle = 0;

var options = {
    enableHighAccuracy: true,
    timeout: pollRate,
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

function travelSpeed(){
    //to-do
    return 0;
}

function isWalking(){
    //to-do
    return false;
}

function success(pos) {
    var crd = pos.coords;
    if (previousCrd != null) {
        distance = calcDistance(previousCrd, crd);
        console.log(distance);
        document.getElementById("test").innerHTML = `Latitude: ${crd.latitude}` +
            `<br/>Longitude: ${crd.longitude}` + `<br/>Accuracy: ${crd.accuracy} meters.` +
            `<br/>Distance from last measurement: ${distance} meters`;
    }
    previousCrd = pos.coords;
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

var intervalId = window.setInterval(function () {
    navigator.geolocation.getCurrentPosition(success, error, options);
}, pollRate);