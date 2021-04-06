var inventory = { bicycle: 0, car: 0, plane: 0, skateboard: 0, spaceship: 0, train: 0 };
var previousCrd = null;
var distanceThisCycle = 0;
var options = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 0
};
var userScore = 0;
var isWalking = false;
loggedInUser = null;

//polls current location every X seconds determined by polling rate
var intervalId = window.setInterval(function () {
    navigator.geolocation.getCurrentPosition(success, error, options);  
}, pollingRate);

//updates database every X seconds determined by update rate
var updateScoreTimer = window.setInterval(function () {
    writeUserScore();
    writeUserInventory();
}, updateRate);

function retrieveUserScore() {
    var user = firebase.auth().currentUser;
    var score = db.collection("scores").doc(user.uid);
    score.get().then((doc) => {
        if (doc.exists) {
            userScore = parseInt(doc.data()["score"]);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function calcTotalStepsPerSecond() {
    if (isWalking){
        return 1
        + inventory.skateboard * stepsPerSecond.skateboard
        + inventory.bicycle * stepsPerSecond.bicycle
        + inventory.car * stepsPerSecond.car
        + inventory.train * stepsPerSecond.train
        + inventory.plane * stepsPerSecond.plane
        + inventory.spaceship * stepsPerSecond.spaceship;
    } else {
        return 0;
    }

}

function updateCounts() {
    $("#skateboard-count").html(inventory.skateboard);
    $("#bicycle-count").html(inventory.bicycle);
    $("#car-count").html(inventory.car);
    $("#train-count").html(inventory.train);
    $("#plane-count").html(inventory.plane);
    $("#spaceship-count").html(inventory.spaceship);

    $("#skateboard-info").html("+" + inventory.skateboard * stepsPerSecond.skateboard + " steps/second");
    $("#bicycle-info").html("+" + inventory.bicycle * stepsPerSecond.bicycle + " steps/second");
    $("#car-info").html("+" + inventory.car * stepsPerSecond.car + " steps/second");
    $("#train-info").html("+" + inventory.train * stepsPerSecond.train + " steps/second");
    $("#plane-info").html("+" + inventory.plane * stepsPerSecond.plane + " steps/second");
    $("#spaceship-info").html("+" + inventory.spaceship * stepsPerSecond.spaceship + " steps/second")

    $("#skateboard-cost").html(Math.round(calcGrowth(basePrices.skateboard, inventory.skateboard)));
    $("#bicycle-cost").html(Math.round(calcGrowth(basePrices.bicycle, inventory.bicycle)));
    $("#car-cost").html(Math.round(calcGrowth(basePrices.car, inventory.car)));
    $("#train-cost").html(Math.round(calcGrowth(basePrices.train, inventory.train)));
    $("#plane-cost").html(Math.round(calcGrowth(basePrices.plane, inventory.plane)));
    $("#spaceship-cost").html(Math.round(calcGrowth(basePrices.spaceship, inventory.spaceship)));

    $("#total-steps-per-second").html("Steps per second: " + calcTotalStepsPerSecond());
    $("#total-steps").html(`Total Steps: ` + Math.round(userScore));
}

function retrieveUserInventory() {
    var user = firebase.auth().currentUser;
    var inventoryDB = db.collection("inventory").doc(user.uid);
    console.log("Logged ID:", user.uid);
    inventoryDB.get().then((doc) => {
        if (doc.exists) {
            inventory.bicycle = parseInt(doc.data()["bicycle"]);
            inventory.car = parseInt(doc.data()["car"]);
            inventory.plane = parseInt(doc.data()["plane"]);
            inventory.skateboard = parseInt(doc.data()["skateboard"]);
            inventory.spaceship = parseInt(doc.data()["spaceship"]);
            inventory.train = parseInt(doc.data()["train"]);
            updateCounts();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function writeUserScore(text) {
    var updateScore = db.collection("scores");
    userScore = Math.round(userScore);
    if (loggedInUser == null) {
        console.warn("User is not logged in!");
    } else {
        updateScore.doc(loggedInUser.uid).set({
            score: userScore
        }, {
            merge: true
        });
    }
}

function writeUserInventory(text) {
    var updateInv = db.collection("inventory");
    if (loggedInUser == null) {
        console.warn("User is not logged in!");
    } else {
        updateInv.doc(loggedInUser.uid).set({
            skateboard: inventory.skateboard,
            bicycle: inventory.bicycle,
            car: inventory.car,
            train: inventory.train,
            plane: inventory.plane,
            spaceship: inventory.spaceship,
        }, {
            merge: true
        });
    }
}

function calcDistance(previousCrd, currentCrd) {
    const R = 6371e3; // meters
    const φ1 = previousCrd.latitude * Math.PI / 180; // φ, λ in radians
    const φ2 = currentCrd.latitude * Math.PI / 180;
    const Δφ = (currentCrd.latitude - previousCrd.latitude) * Math.PI / 180;
    const Δλ = (currentCrd.longitude - previousCrd.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distanceThisCycle = R * c;
    return d = R * c; // in meters
}

function travelSpeed() {
    return distanceThisCycle / (pollingRate / 1000); //meters per second
}

function checkIsWalking() {
    if (debug){
        isWalking = true;
    } else {
        if (travelSpeed() > 1.5){
            isWalking = true;
        } else {
            isWalking = false;
        }
    }
}

function handleUserScore() {
    userScore += 1
        + (inventory.bicycle * stepsPerSecond.bicycle)
        + (inventory.skateboard * stepsPerSecond.skateboard)
        + (inventory.car * stepsPerSecond.car)
        + (inventory.spaceship * stepsPerSecond.spaceship)
        + (inventory.train * stepsPerSecond.train)
        + (inventory.plane * stepsPerSecond.plane);
}

function success(pos) {
    var crd = pos.coords;
    if (previousCrd != null) {
        distance = calcDistance(previousCrd, crd);
        console.log("Distance:", distance);
        checkIsWalking();
        if (isWalking){
            handleUserScore();
            distance = calcDistance(previousCrd, crd);
        }
    }

    updateCounts();
    if(textDebug){
        $("#debug").html("isWalking: " + isWalking);
    }
    previousCrd = pos.coords;
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function calcGrowth(base, x) {
    return base * Math.pow((1 + growthRate), x)
}

function getPropertyName(id) {
    switch (id) {
        case "skateboard-button":
            return "skateboard";
        case "bicycle-button":
            return "bicycle";
        case "car-button":
            return "car";
        case "train-button":
            return "train";
        case "plane-button":
            return "plane";
        case "spaceship-button":
            return "spaceship";
    }
}

function increaseInventoryCount(inventoryType) {
    switch (inventoryType) {
        case "skateboard":
            inventory.skateboard++;
            break;
        case "bicycle":
            inventory.bicycle++;
            break;
        case "car":
            inventory.car++;
            break;
        case "train":
            inventory.train++;
            break;
        case "plane":
            inventory.plane++;
            break;
        case "spaceship":
            inventory.spaceship++;
            break;
        default:
            break;
    }
    updateCounts();
}

function createParticleDiv(e, inventoryType) {
    var bezier_params = {
        start: {
            x: e.pageX - 20,
            y: e.pageY - 20,
        },
        end: {
            x: e.pageX + ((Math.round(Math.random()) * 2 - 1) * (Math.random() * 100)),
            y: e.pageY + ((Math.round(Math.random()) * 2 - 1) * (Math.random() * 100)),
            length: Math.random()
        }
    };

    console.log(bezier_params);

    $(function () {
        $("<div></div>")
            .hide()
            .css({
                "position": "absolute",
                "left": (e.pageX - 20) + 'px',
                "top": (e.pageY - 20) + 'px',
                "z-index": "1000000",
                "pointer-events": "none",
                "max-width": "25px"

            })
            .append($('<img src="images/' + inventoryType + '.png" alt="myimage" />'))
            .appendTo("#particles")
            .fadeIn("fast")
            .animate({ path: new $.path.bezier(bezier_params) })
            .delay(500)
            .fadeOut("fast");
    });
}

$(".game-button").click(function (e) {
    buttonType = $(this).attr("id");
    inventoryType = getPropertyName(buttonType);

    price = calcGrowth(basePrices[inventoryType], inventory[inventoryType]);
    if (userScore >= price) {
        userScore -= price;
        increaseInventoryCount(inventoryType);
        createParticleDiv(e, inventoryType);
    }
});

$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedInUser = user;
            console.log("Logged in as", loggedInUser.displayName);
            retrieveUserScore();
            retrieveUserInventory();
        } else {
            console.warn("No user detected!");
            window.location.href = "login.html";
        }
    });
});
