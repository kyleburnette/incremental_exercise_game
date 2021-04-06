function scoreQuery() {
    db.collection("scores")
        .where("score", ">", 1)
        //.where("hemisphere", "==", "south")
        .limit(10)
        //.orderBy("population")
        .orderBy("score", "desc")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var n = doc.data();
                var highScore = doc.data().score;
                console.log(n);
                console.log(highScore);
                var newdom = "<p> " + n + " " + highScore + "</p>";
                //$("#score-goes-here").append(newdom);
                //document.getElementById("cities-go-here").innerHTML = newdom;
                var body = document.body,
                    tbl = document.createElement('table');
                tbl.style.width = '500px';
                tbl.style.border = '1px solid black';

                for (var i = 0; i < 2; i++) {
                    var tr = tbl.insertRow();
                    for (var j = 0; j < 2; j++) {
                        if (i == 0 && j == 0) {
                            break;
                        } else {
                            var td = tr.insertCell();
                            td.append(highScore);
                            td.style.border = '1px solid black';
                            //if(i == 1 && j == 1){
                            //td.setAttribute('rowSpan', '3');
                            //}
                        }
                    }
                }
                body.appendChild(tbl);

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

// function tableCreate() {
//     var body = document.body,
//         tbl = document.createElement('table');
//     tbl.style.width = '500px';
//     tbl.style.border = '1px solid black';

//     for (var i = 0; i < 11; i++) {
//         var tr = tbl.insertRow();
//         for (var j = 0; j < 3; j++) {
//             if (i == 0 && j == 0) {
//                 break;
//             } else {
//                 var td = tr.insertCell();
//                 td.n;
//                 td.style.border = '1px solid black';
//                 //if(i == 1 && j == 1){
//                 //td.setAttribute('rowSpan', '3');
//                 //}
//             }
//         }
//     }
//     body.appendChild(tbl);
// }
// tableCreate();