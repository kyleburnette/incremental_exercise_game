//The user's current inventory.
var inventory = { bicycle: 0, car: 0, plane: 0, skateboard: 0, spaceship: 0, train: 0 };

//The previous coordinate. Used to calculate distance between
//polled locations.
var previousCrd = null;

//Distance travelled between now and the previous coordinate.
var distanceThisCycle = 0;

//Options to be used for the geolocation API.
var options = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 0
};

//the user's current score.
var userScore = 0;

//Global variable that says if user is walking or not.
var isWalking = false;

//A reference to the currently logged in user.
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

/**
 * Retrieves user's score from Firebase.
 */
function retrieveUserScore() {
    var user = firebase.auth().currentUser;
    var score = db.collection("scores").doc(user.uid);
    score.get().then((doc) => {
        if (doc.exists) {
            userScore = parseInt(doc.data()["score"]);
        } else {
            // doc.data() will be undefined in this case
            console.warn("No such document!");
        }
    }).catch((error) => {
        console.warn("Error getting document:", error);
    });
}

/**
 * Calculates users's total steps per second based on
 * whether they are walking or not and also their
 * current inventory.
 * 
 * @return The current total steps per second for this user.
 */
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

/**
 * Updates DOM elements for all inventory items, including 
 * counts and costs.
 */
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

/**
 * Fetches user's inventory from the database.
 */
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
            updateCounts();
        } else {
            // doc.data() will be undefined in this case
            console.error("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
}

/** 
 * Writes user's current score to the database.
 */
function writeUserScore() {
    var updateScore = db.collection("scores");
    userScore = Math.round(userScore);
    if (loggedInUser == null) {
        console.warn("User is not logged in!");
    } else {
        updateScore.doc(loggedInUser.uid).set({
            score: userScore,
            name: loggedInUser.displayName
        }, {
            merge: true
        });
    }
}

/**
 * Writes user's current inventory to the database.
 */
function writeUserInventory() {
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

/**
 * Calculates the distance a user has traveled since the
 * last poll.
 * 
 * @return the distance since the last update
 */
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

/**
 * Calculates user's walking speed.
 * @return the speed the user is walking
 */
function travelSpeed() {
    return distanceThisCycle / (pollingRate / 1000); //meters per second
}

/**
 * Checks if a user is walking by comparing their 
 * travel speed to a minimum walking speed.
 */
function checkIsWalking() {
    if (debug){
        isWalking = true;
    } else {
        if (travelSpeed() > minimumWalkingSpeed){
            isWalking = true;
        } else {
            isWalking = false;
        }
    }
}

/**
 * Calculates user's score for their given inventory.
 */
function handleUserScore() {
    userScore += 1
        + (inventory.bicycle * stepsPerSecond.bicycle)
        + (inventory.skateboard * stepsPerSecond.skateboard)
        + (inventory.car * stepsPerSecond.car)
        + (inventory.spaceship * stepsPerSecond.spaceship)
        + (inventory.train * stepsPerSecond.train)
        + (inventory.plane * stepsPerSecond.plane);
}

/** 
 * Called when user's location is successfully obtained.
 * This function checks if the user is walking, and if
 * they are, it adds score.
 * @param pos The user's position
 */
function success(pos) {
    var crd = pos.coords;
    if (previousCrd != null) {
        distance = calcDistance(previousCrd, crd);
        checkIsWalking();
        if (isWalking){
            handleUserScore();
        }
    }

    updateCounts();
    previousCrd = pos.coords;
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

/**
 * Calculates exponential growth of item based on how
 * many of that item the user currently has.
 * @param base The base cost of this item
 * @param x the amount of this item the user has
*/
function calcGrowth(base, x) {
    return base * Math.pow((1 + growthRate), x)
}

/**
 * Returns appropriate string for whatever the id
 * was of the button that was clicked.
 * 
 * @param id The id of the inventory that was clicked
 * @return the sliced string version of the button that was clicked
*/
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

/**
 * Based on whatever the user purchases, 
 * increments inventory count.
 * @param inventoryType - the type of inventory that was clicked
*/
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

/**
 * Spawns an animation when a user purchases an item. Using bezier curves from jquery.path.js, 
 * this animation is randomly generated.
 * 
 * @param e The event generated by the user's click.
 * @param inventoryType The type of button that was clicked on.
*/
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
            .append($('<img class="particle" src="../images/' + inventoryType + '.png" alt="myimage" />'))
            .appendTo("#particles")
            .fadeIn("fast")
            .animate({ path: new $.path.bezier(bezier_params) })
            .fadeOut(500, function(){
                $(this).remove();
            });
    });
}

/** 
 * This function updates the prices of items when you purchase/click an
 * item. It also makes sure you have enough score to purchase that 
 * item, and if so, increases your inventory count and spawns an
 * animation.
 * 
 * @param e The event generated by the user clicking
*/
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

/**
 * When firebase verifies that a verified user has logged in,
 * retrieves user score and inventory from the database.
 *
 * If there is no user logged in, returns to login.html.
 */
$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedInUser = user;
            retrieveUserScore();
            retrieveUserInventory();
        } else {
            console.warn("No user detected!");
            window.location.href = "login.html";
        }
    });
});
