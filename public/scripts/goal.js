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
                var div = document.getElementById('leaderboard');
                var tbl = document.createElement('table');
                var highScoreString = highScore ;
                tbl.style.width = '100%';
                var header = tbl.createTHead();
                var row = header.insertRow(0); 
                //tbl.style.maxWidth = "100 px";
                //tbl.style.borderBottom = '1px solid black';
                tbl.className = "table table-bordered ";
                
/*                 for (var j = 0; j < 3; j++) {
                    var tk = tbl.insertRow(0);
                } */
                //rows
                for (var i = 0; i < 1; i++) 
                    var tr = tbl.insertRow();
                    var td = tr.insertCell();
                    var tk = tr.insertCell();

                        // values              
                        for (var k = 0; k < 1; k++){
                        if (i == 0 && k == 0) {
                            break;
                        } else {
                            //var tk = tk.insertCell();
                            tk.append(highScoreString);
                            td.append(n);
                            //tk.append(highScore);
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
function displayGoal(){
    var userGoal = 0;
    var user = firebase.auth().currentUser;
    var stepGoals = db.collection("user").doc(user.uid);
    var div = document.getElementById('currentGoal');

    stepGoals.get().then((doc) => {
        if (doc.exists) {
            userGoal = doc.data().goal;
            //console.log(userGoal);
            var userGoalString = " " + userGoal ;
            //div.appendChild(userGoal);
            $("#goal-display").append(userGoalString + " Steps");
               
        } else {
            $("#goal-display").append(userGoal + " Steps");
            console.log(userGoal );

        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
displayGoal;


