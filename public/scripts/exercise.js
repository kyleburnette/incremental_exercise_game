// Updates the page to show the Map View with current date of session
function startView() {
    var heading = "Map View - ";
    var date = new Date();
    dateObj = date;
    $(".exercise-heading").html(heading.concat(date));
}

// Sets up the destination for the map and then updates the map on user input
function initMap() {
    destinationLat = 0;
    destinationLng = 0;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = { lat: position.coords.latitude, lng: position.coords.longitude };
            updateMap([pos.lat, pos.lng]);
        });
    } else {
        console.log("Unsupported browser.");
    }
}

// Creates the static map view using previously specified positions
function initMapView() {
    updateMapView();
}

// Initializes map components and handles updates for destination on user input
function updateMap(val) {
    crd = { 'lat': val[0], 'lng': val[1] };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: parseFloat(crd.lat), lng: parseFloat(crd.lng) },
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
        position: { lat: parseFloat(crd.lat), lng: parseFloat(crd.lng) },
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
        position: { lat: parseFloat(crd.lat), lng: parseFloat(crd.lng) },
        map: map,
        icon: location_marker,
    });
}

// Initializes the Map View for session with all specified values by user
function updateMapView() {
    const mapView = new google.maps.Map(document.getElementById("mapView"), {
        center: { lat: crd.lat, lng: crd.lng },
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        zoom: 12,
    });

    destinationMarker = new google.maps.Marker({
        position: { lat: destinationLat, lng: destinationLng },
        icon: destination_marker,
    });
    destinationMarker.setMap(mapView);

    // user's current position pin
    positionMarker = new google.maps.Marker({
        position: { lat: crd.lat, lng: crd.lng },
        icon: location_marker,
    });
    positionMarker.setMap(mapView);

    // create the optimal route to destination
    if (routeOption == "off") {
        console.log("Route not specified, ignoring request.");
    } else {
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
        directionsDisplay.setMap(mapView);
        findRoute(directionsService, directionsDisplay);
    };

    pathCoordinates = [
        { lat: crd.lat , lng: crd.lng }
    ];

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

// Sets value for routeOption to on, if the user wants optimal routing
function setRouteOption() {
    routeOption = $("input[name=routingOption]:checked").val();
    console.log("Selected Route Option:", routeOption);
}

// Finds the optimal route to the destination specified by the user
function findRoute(directionsService, directionsDisplay) {
    var destinationCrd = {'lat': destinationLat, 'lng': destinationLng};
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

// Draws the path the user has taken so far 
function drawPath(pos) {
    // Create poly lines to create route and append lat and lng to an array for each point to save.
    var holdPos = {};
    var tempPos = {};
    holdPos = pos;
    tempPos.lat = holdPos.latitude;
    tempPos.lng = holdPos.longitude;
    pathCoordinates.push(tempPos);
    console.log("New Point Coordinates: ", pathCoordinates);
}

// Takes coordinates from drawPath
function updatePath() {
    console.log("Updating path");
    userPath.setPath(pathCoordinates);
}

// Change map view elements style to show, hide previous elements
function toggleMapViewElements() {
    $("#mapView").css("display", "block");
    $("#disclaimer").css("display", "none");
    $(".stop-button").css("display", "block");
    $(".map-line").css("display", "block");
    $(".setup-button").css("display", "none");

}

// Calculate time required to destination with Distance Matrix API
function calcTimeRequired() {
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
            duration = responseDis.rows[0].elements[0].duration.text;
            $("#timeGiven").html(duration);
        }
    }
}

// Shows the map view modal for user to see their route
function toggleMap() {
    trackingState = true;
    toggleMapViewElements();
    // Increments the timer every second
    var intervalTimer = window.setInterval(function () {
        if (destinationSet == true) {
            ++timer;
            updateTime(timer);
        }
    }, 1000);

    // only do this if the user sets a destination
    if (destinationSet == true) {
        // show timer and estimated time required
        $(".timer").css("display", "block");
        $(".timeTotal").css("display", "block");
        // calculate time to destination
        calcTimeRequired();
    }
    initMapView();
    startView();
}

// Updates the timer
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

// Formats the passed integer (in milliseconds) to a human-readable String
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

// Checks and returns the duration of the session
function checkTime(endTime) {
    var diff = (dateObj.getTime() - endTime.getTime());
    var minutes = diff / 1000 / 60;
    return Math.abs(Math.round(minutes));
}

// Sets the values for time and duration bonus score multipliers
function setMultipliers(doc) {
    allowedTimeMultiplier = Math.max(0.25, parseFloat(doc.data()["timeMultiplier"]));
    allowedTimeMultiplier = Math.min(3, allowedTimeMultiplier);
    console.log("Permitted Time Multiplier:", allowedTimeMultiplier);
    durationMultiplier = Math.max(0.25, parseFloat(doc.data()["durationMultiplier"]));
    durationMultiplier = Math.min(3, durationMultiplier);
    console.log("Permitted Duration Multiplier:", durationMultiplier);
}

// Applies the score multipliers to the bonus score and returns the bonus score
function scoreMultiplier(distance) {
    // timeMultiplier = Total estimated time to finish divided by total time taken
    // timeMultiplier will be < 1 if total time taken is negative
    var user = firebase.auth().currentUser;
    var userDb = db.collection("user").doc(user.uid);
    userDb.get().then((doc) => {
        if (doc.exists) {
            setMultipliers(doc);
        } else {
            // doc.data() will be undefined in this case
            console.warn("No such document!");
        }
    }).catch((error) => {
        console.warn("Error getting document:", error);
    });
    const baseMultiplier = 0.25;
    var timeMultiplier = 1;
    if (destinationSet == true) {
        var timeCap = timespanMillis(duration) * durationMultiplier * allowedTimeMultiplier;
        timeMultiplier = timeCap / timer;
        if (timeMultiplier < 1) {
            timeMultiplier = Math.max(timeMultiplier, 0.25);
        } else if (timeMultiplier > 1) {
            timeMultiplier = Math.min(timeMultiplier, 3);
        } else {
            timeMultiplier = 1;
        }
    }

    var bonusScore = totalDistance * baseMultiplier;
    console.log("Time Multipler:", timeMultiplier);
    bonusScore *= timeMultiplier;
    return totalDistance + bonusScore;
}

// Ends the session, calculates statistics and score, and writes stats and score to database
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
    } else if (flagCounter > 30) {
        $("#error-message").html("<h4>Session was ended due to abnormal travel speed, this application will not work if you are driving. Otherwise your GPS may be too inaccurate to use this application.</h4><hr />");
    } else if (totalDistance <= 0) {
        $("#error-message").html("<h4>Distance travelled is zero, this session will not be recorded.</h4><hr />");
    } else if (checkTime(endTime) < 3) {
        $("#error-message").html("<h4>Session time is less than 3 minutes, this session will not be recorded.</h4><hr />");
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
    var tempScore = scoreMultiplier(totalDistance);
    tempScore = tempScore * calcTotalStepsPerSecond();
    console.log(tempScore);
    $("#bonusScore").html(`${Math.round(tempScore)}`);

    if (routeError == false && flagCounter <= 30 && totalDistance > 0) {
        userScore += scoreMultiplier(totalDistance);
        userScore = userScore * calcTotalStepsPerSecond();
        console.log(userScore);
        $("#bonusScore").html(`${Math.round(userScore)}`);
        writeUserScore();
        if (checkTime(endTime) >= 3) {
            // Create a database entry of exercise and then move on to feedback and adjustments
            var user = firebase.auth().currentUser;

            var step = db.collection("user").doc(user.uid);
            step.get().then((doc) => {
                if (doc.exists) {
                    var oldStep;
                    if (oldStep == NaN || oldStep == null) {
                        oldStep = 0;
                    } else {
                        oldStep = parseInt(doc.data()["step"]);
                    }
                    console.log(oldStep);
                    step.set({
                        steps: oldStep + totalSteps
                    }, {
                        merge: true
                    })
                } else {
                    // doc.data() will be undefined in this case
                    console.warn("No such document!");
                }
            }).catch((error) => {
                console.warn("Error getting document:", error);
            });

            var sessionDb = db.collection("user").doc(user.uid).collection("sessions");
            sessionDb.add({
                date: dateObj,
                routeOption: routeOption,
                startPosition: startPosition,
                destinationPosition: destinationPosition,
                totalTime: formatDate(endTime),
                distanceTravelled: (totalDistance / 1000).toFixed(2),
                stepsTaken: totalSteps,
                minCaloriesBurned: totalMinCalories.toFixed(2),
                maxCaloriesBurned: totalMaxCalories.toFixed(2),
                path: pathCoordinates
            }).then((docRef) => {
                console.log("Entry written to:", docRef.id);
            }).catch((error) => {
                console.error("Error added document:", error);
            })
        } else {
            console.warn("Session not longer than 3 minutes, not saving.");
        }
    } else {
        console.warn("Error was detected, database will not be updated.");
    }
}

// Function to convert a String of time to milliseconds
var timespanMillis = (function() {
    var tMillis = {
        second: 1000,
        min: 60 * 1000,
        minute: 60 * 1000,
        hour: 60 * 60 * 1000 // etc.
    };
    return function(s) {
        var regex = /(\d+)\s*(second|min|minute|hour)/g, ms=0, m, x;
        while (m = regex.exec(s)) {
            x = Number(m[1]) * (tMillis[m[2]]||0);
            ms += x;
        }
        return x ? ms : NaN;
    };
})();


// Formula to calculate the distance from the previously tracked coordinate to the current coordinate
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

/****************************************************************
 * Function performed upon position tracked successfully,
 * performs many other tasks to run the exercise session
 * and updating map as well as handling invalid values
 ****************************************************************/
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
        if (crd.accuracy > 30) {
            console.log("Accuracy:", crd.accuracy);
            console.log("Inaccurate, did not take position.");
        } else {
            distance = calcDistance(previousCrd, crd);
            if (trackingState) {
                if (distance > 35) {
                    flagCounter++;
                    if (flagCounter <= 30) {
                        console.warn("Abnormal distance tracked:", distance, "ignoring update.");
                    } else {
                        endExercise();
                    }
                    updateCrd = false;
                } else if (distance > 5) {
                    flagCounter = 0;
                    console.log("Updated position");
                    updateMarker(crd);
                    drawPath(crd);
                    updatePath();
                    totalDistance += distance;
                    console.log("Total Distance:", totalDistance);
                    updateCrd = true;
                } else {
                    flagCounter = 0;
                    console.log("Distance travelled insignificant, ignoring update.");
                    updateCrd = false;
                }
            }
        }
    }
    if (trackingState) {
        if (crd.accuracy > 30) {
            console.log("Accuracy:", crd.accuracy);
            console.log("Inaccurate, did not change previous coordinate.");
        } else {
            if (updateCrd) {
                previousCrd = pos.coords;
            }
        }
        if (destinationSet) {
            console.log("Distance to destination:", calcDistance(startPosition, destinationPosition));
            if (calcDistance(startPosition, destinationPosition) < 25) {
                console.log("Arrived at destination");
                $("#completedModal").modal("toggle");
                endExercise();
            } 
        }
    }
}

// Updates the position of the user's location marker on the map view
function updateMarker(pos) {
    positionMarker.setPosition({ lat: pos.latitude, lng: pos.longitude });
}

// Error handler, sends warning to the console
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Writes the adjustments and feedback by the user to the database
function applyFeedback() {
    difficultyRating = $("input[name=difficultyRating]:checked").val();
    durationRating = $("input[name=durationRating]:checked").val();
    recentFeedback = $("input[name=exerciseRating]").val();
    var userDb = db.collection("user").doc(loggedInUser.uid);

    userDb.get().then((doc) => {
        if (doc.exists) {
            // Get multipliers from database as floats
            allowedTimeMultiplier = parseFloat(doc.data()["timeMultiplier"]);
            durationMultiplier = parseFloat(doc.data()["durationMultiplier"]);
            // Min multiplier of 0.25 and max of 3
            var newDifficulty = difficultyRating * allowedTimeMultiplier;
            newDifficulty = Math.max(0.25, (newDifficulty));
            newDifficulty = Math.min(3, (newDifficulty));
            // Min multiplier of 0.25 and max of 3
            var newDuration = durationRating * durationMultiplier;
            newDuration = Math.max(0.25, (newDuration));
            newDuration = Math.min(3, (newDuration));

            if (loggedInUser == null) {
                console.warn("User is not logged in!");
                window.location.href = "login.html";
            } else {
                var checkFeedback = db.collection("user");
                userDb.get().then((doc) => {
                    if (doc.exists) {
                        checkFeedback.doc(loggedInUser.uid).set({
                            timeMultiplier: newDifficulty,
                            durationMultiplier: newDuration,
                            recentFeedback: recentFeedback
                        }, {
                            merge: true
                        })
                    } else {
                        console.warn("Document does not exist!")
                    }
                }).catch((error) => {
                    console.warn("Error getting document:", error);
                });
            }
            console.log("New Difficulty Rating:", newDifficulty);
            console.log("New Duration Rating:", newDuration);
            console.log("Exercise Rating:", recentFeedback);
        } else {
            // doc.data() will be undefined in this case
            console.warn("No such document!");
        }
    }).catch((error) => {
        console.warn("Error getting document:", error);
    });
    setTimeout(() => window.location.reload(), 1000);
}

// Gets the multiplier from the user
function retrieveMultiplier() {
    var checkMultiplier = db.collection("user");
    if (loggedInUser == null) {
        console.warn("User is not logged in!");
        window.location.href = "login.html";
    } else {
        var userDb = db.collection("user").doc(loggedInUser.uid);
        userDb.get().then((doc) => {
            if (doc.exists) {
                if (doc.data()["timeMultiplier"] == null) {
                    console.log("Set new time multiplier");
                    checkMultiplier.doc(loggedInUser.uid).set({
                        timeMultiplier: 1
                    }, {
                        merge: true
                    })
                }
                if (doc.data()["durationMultiplier"] == null) {
                    console.log("Set new duration multiplier");
                    checkMultiplier.doc(loggedInUser.uid).set({
                        durationMultiplier: 1
                    }, {
                        merge: true
                    })
                }
            } else {
                console.log("Create user document with base multipliers");
                checkMultiplier.doc(loggedInUser.uid).set({
                    timeMultiplier: 1,
                    durationMultiplier: 1
                }, {
                    merge: true
                })
            }
        }).catch((error) => {
            console.warn("Error getting document:", error);
        });
    }
}

// Retrieves the user's current score from database
// Used when session is complete and updating score
function retrieveUserScore() {
    var user = firebase.auth().currentUser;
    var score = db.collection("scores").doc(user.uid);
    console.log("Logged ID:", user.uid);
    score.get().then((doc) => {
        if (doc.exists) {
            savedScore = parseInt(doc.data()["score"]);
            console.log("Current Score:", savedScore);
        } else {
            // doc.data() will be undefined in this case
            console.warn("No such document!");
        }
    }).catch((error) => {
        console.warn("Error getting document:", error);
    });
}

// Updates user score on database
function writeUserScore(text) {
    var updateScore = db.collection("scores");
    userScore = Math.round(userScore);
    if (loggedInUser == null) {
        console.warn("User is not logged in!");
        window.location.href = "login.html";
    } else {
        updateScore.doc(loggedInUser.uid).set({
            score: savedScore + userScore
        }, {
            merge: true
        })
    }
}

// Calculates the user's total steps per second with all items
function calcTotalStepsPerSecond() {
    return 1
        + inventory.skateboard * stepsPerSecond.skateboard
        + inventory.bicycle * stepsPerSecond.bicycle
        + inventory.car * stepsPerSecond.car
        + inventory.train * stepsPerSecond.train
        + inventory.plane * stepsPerSecond.plane
        + inventory.spaceship * stepsPerSecond.spaceship
}

// Retrieves number of all items in user's inventory from the database
// updates local inventory for bonus score calculation
function retrieveUserInventory() {
    var user = firebase.auth().currentUser;
    var inventoryDB = db.collection("inventory").doc(user.uid);
    inventoryDB.get().then((doc) => {
        if (doc.exists) {
            inventory.bicycle = parseInt(doc.data()["bicycle"]);
            inventory.car = parseInt(doc.data()["car"]);
            inventory.plane = parseInt(doc.data()["plane"]);
            inventory.skateboard = parseInt(doc.data()["skateboard"]);
            inventory.spaceship = parseInt(doc.data()["spaceship"]);
            inventory.train = parseInt(doc.data()["train"]);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

// Checks if the device is a mobile device, otherwise outputs a message for the user
function checkDevice() {
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
}

$("#destinationModal").on('shown.bs.modal', function () {
    initMap();
    google.maps.event.trigger(map, "resize");
});

$(document).ready(function () {
    // Check if the user is signed in, redirect to login if not signed in
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedInUser = user;
            console.log("Logged in as", loggedInUser.displayName);
            retrieveMultiplier();
            retrieveUserInventory();
            retrieveUserScore();
        } else {
            console.warn("No user detected!");
            window.location.href = "login.html";
        }
    });

    // The code that runs all the functions required to start the exercise
    checkDevice();
    if (deviceType == "Mobile") {
        navigator.geolocation.getCurrentPosition(success, error, options);
        // Polls for user location and updates crd
        var intervalId = window.setInterval(function () {
            // continue checking if the device is mobile, inspect element on mobile view will mess up if you don't
            if (deviceType == "Mobile") {
                navigator.geolocation.getCurrentPosition(success, error, options);
            } else {
                console.warn("User is not on a mobile device, not running application.");
            }
        }, 1000);
    } else {
        console.warn("User is not on a mobile device, not running application.");
    }
});