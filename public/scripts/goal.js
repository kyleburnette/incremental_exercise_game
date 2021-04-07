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
                var newdom = n + " " + highScore ;
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
    })
    .then(function () {
        window.location.href = "goal.html";
    });
}

// Writes the Step Goal 
function getStepGoal() {
    document.getElementById("button-submit").addEventListener('click', function () {
        var goal = document.getElementById("goal-input").value;
        console.log(goal);
        writeStepGoal(goal);
    });
}
getStepGoal();
