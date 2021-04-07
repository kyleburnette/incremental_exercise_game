function scoreQuery() {
    db.collection("scores")
        .where("score", ">", 1)
        .limit(10)
        //.orderBy("population")
        .orderBy("score", "desc")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var n = doc.data().name;
                var highScore = doc.data().score;
                console.log(n);
                console.log(highScore);
                var newdom = n + " " + highScore;
                console.log(newdom);
                //$("#score-goes-here").append(newdom);
                //document.getElementById("cities-go-here").innerHTML = newdom;
                var div = document.getElementById('leaderboard');
                var tbl = document.createElement('table');
                tbl.style.width = '100%';
                tbl.style.borderBottom = '1px solid black';

                for (var i = 0; i < 2; i++) {
                    var tr = tbl.insertRow();
                    for (var j = 0; j < 3; j++) {
                        if (i == 0 && j == 0) {
                            break;
                        } else {
                            var td = tr.insertCell();
                            td.append(n);
                            //td.style.border = '1px solid black';
                            //if(i == 1 && j == 1){
                            //td.setAttribute('rowSpan', '3');
                            //}
                        }
                    }
                }
                div.appendChild(tbl);

            })
        })
}
scoreQuery();

$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userName = user;
            console.log("Logged in as", userName.displayName);
            displayGoal();
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

// Writes the Step Goal 
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
// add merge here.
function redeemGoal() {
    var user = firebase.auth().currentUser;
    var stepGoals = db.collection("user");
    var goalReset = 1;
    stepGoals.doc(user.uid).set({
            goal: goalReset
        }, {
            merge: true
        })
        .then(function () {
            //window.location.href = "goal.html";
        });
}

// Redeem Goal Button click from user
function redeemGoalButton() {
    document.getElementById("button-redeem").addEventListener('click', function () {
        redeemGoal();
        console.log("hello");
    });
}
redeemGoalButton();

// Displays Current Goal Count
function displayGoal(){
    var userGoal = 0;
    var user = firebase.auth().currentUser;
    var stepGoals = db.collection("user").doc(user.uid);
    var div = document.getElementById('currentGoal');
    stepGoals.get().then((doc) => {
        if (doc.exists) {
            userGoal = doc.data().goal;      
            div.appendChild(userGoal);    
        } else {
            userGoal = 0;
            console.log("Goal Default");
            //$("#goal-display").attr(userGoal);
            div.appendChild(userGoal);    

        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
