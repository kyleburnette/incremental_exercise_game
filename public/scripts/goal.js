$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userName = user;
            console.log("Logged in as", userName.displayName);
            //writeGoalField();
            writeSteps();
            displayGoal();
            displaySteps();
            getUserSteps();
            //retrieveUserScore();
            //retrieveUserInventory();
        } else {
            console.warn("No user detected!");
            window.location.href = "login.html";
        }
    });
});

//Initalize the goal field for user when they visit goal.html for 1st time.
function writeGoalField() {
    var goalStart = 0;
    var user = firebase.auth().currentUser;
    var goalField = db.collection("user").doc(user.uid);
    goalField.get().then((doc) => {
        if (doc.exists) {
            goalStart = doc.data().goal;
            console.log("hi");
        } else {
            goalField.add({
                goal: goalStart
            }, {
                merge: true
            })
        }
    }).catch((error) => {
        console.warn("Error getting document:", error);
    });
}


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
    var stepGoals = db.collection("user").doc(user.uid);
    var goalReset = 0;
    var stepsByUser;
    var goalByUser;
    stepGoals.get().then((doc) => {
        if (doc.exists) {
            stepsByUser = doc.data().steps;
            goalByUser = doc.data().goal;
            var complete = stepsByUser / goalByUser;
            if (complete >= 1) {
                var stepMinusGoal = stepsByUser - goalByUser;
                stepGoals.set({
                    goal: goalReset,
                    steps: stepMinusGoal
                }, {
                    merge: true
                })
                .then(function () {
                    window.location.href = "goal.html";
                });
            } else {
                $('#warningModalRedeemGoal').modal('show');
            }
        }
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
            $("#goal-display").append(userGoal + " Steps");
        } else {
            $("#goal-display").append(userGoal + " Steps");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
//displayGoal;


// Write step if no step found, create new
function writeSteps() {
    var userSteps = 0;
    var user = firebase.auth().currentUser;
    var step = db.collection("user").doc(user.uid);
    step.get().then((doc) => {
        if (doc.exists) {
            userSteps = doc.data().steps;
        } else {
            step.set({
                steps: userSteps
            }, {
                merge: true
            })
        }
    }).catch((error) => {
        console.warn("Error getting document:", error);
    });
}
writeSteps();


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
//displaySteps;

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
            var progress = (steps / stepGoal) * 100;
            $('.progress-bar').css('width', progress + '%').attr('aria-valuenow', progress);
        } else {
            steps = 0;
            stepGoal = 1;
            var progress = steps / stepGoal;
            $('.progress-bar').css('width', progress + '%').attr('aria-valuenow', progress);

        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

// Prevents user from enter any other characters besides Numbers into goal input field.
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

setInputFilter(document.getElementById("goal-input"), function (value) {
    return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
});