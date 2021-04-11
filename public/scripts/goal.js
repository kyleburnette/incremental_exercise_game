$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userName = user;
            console.log("Logged in as", userName.displayName);
            displayGoal();
            displaySteps();
            writeSteps();
            getUserSteps();
            //retrieveUserScore();
            //retrieveUserInventory();
        } else {
            console.warn("No user detected!");
            window.location.href = "login.html";
        }
    });
});

// Writes Step Goal
function writeStepGoal(Number) {
    var stepGoals = db.collection("user");
    var user = firebase.auth().currentUser;
    stepGoals.doc(user.uid).set({
            goal: Number,
            user: user.displayName
        }, {
            merge: true
        })
        .then(function () {
            window.location.href = "goal.html";
        });
}

// Writes the Step Goal inputted by user
function getStepGoal() {
    document.getElementById("button-submit").addEventListener('click', function () {
        var goal = document.getElementById("goal-input").value;
        if (goal < 1 || goal > 10000) {
            $('#warningModal').modal('show');
        } else {
            goal = Math.floor(goal);
            writeStepGoal(goal);
        }
    });
}
getStepGoal();


// Redeem Step Goal
function redeemGoal() {
    var user = firebase.auth().currentUser;
    var stepGoals = db.collection("user");
    var goalReset = 0;
    stepGoals.doc(user.uid).set({
            goal: goalReset
        }, {
            merge: true
        })
        .then(function () {
            window.location.href = "goal.html";
        });
}

// Redeem Goal Button click from user
function redeemGoalButton() {
    document.getElementById("button-redeem").addEventListener('click', function () {
        redeemGoal();
    });
}
redeemGoalButton();

// Displays Current Goal Count
function displayGoal() {
    var userGoal = 0;
    var user = firebase.auth().currentUser;
    var stepGoals = db.collection("user").doc(user.uid);

    stepGoals.get().then((doc) => {
        if (doc.exists) {
            userGoal = doc.data().goal;
            var userGoalString = " " + userGoal;
            $("#goal-display").append(userGoalString + " Steps");

        } else {
            $("#goal-display").append(userGoal + " Steps");
            //console.log(userGoal);

        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
displayGoal;


// Write step if no step found, create new
function writeSteps() {
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
            step.set({
                steps: oldStep 
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
}


// Display amount of steps by user.
function displaySteps() {
    var user = firebase.auth().currentUser;
    var stepNum = 0;
    var steps = db.collection("user").doc(user.uid);
    steps.get().then((doc) => {
        if (doc.exists) {
            stepNum = doc.data().steps;
            $("#step-display").append(stepNum + " : ");
        } else {
            $("#step-display").append(stepNum + " : ");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
}
displaySteps;

// Get user steps use for progress bar
function getUserSteps() {
    var steps = 0;
    var stepGoal = 0;
    var user = firebase.auth().currentUser;
    var userStep = db.collection("user").doc(user.uid);

    userStep.get().then((doc) => {
        if (doc.exists) {
            steps = doc.data().steps;
            stepGoal = doc.data().goal;
            var progress = steps / stepGoal;
            //console.log(progress);
            $('.progress-bar').css('width', progress+'%').attr('aria-valuenow', progress); 
        } else {
            steps = 0;
            // step goal is 1 because 0/0 = bad so 0/1 good.
            stepGoal = 1;
            var progress = steps / stepGoal;
            $('.progress-bar').css('width', progress+'%').attr('aria-valuenow', progress); 

        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

