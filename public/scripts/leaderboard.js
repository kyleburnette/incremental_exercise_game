/**  
 * Reads the database of scores
 * prints out table of the top 10 highest scores from highest to lowest with display name.
 */
function scoreQuery() {
    db.collection("scores")
        .where("score", ">", 1)
        .limit(10)
        .orderBy("score", "desc")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var n = doc.data().name;
                var highScore = doc.data().score;
                var div = document.getElementById('leaderboard');
                var tbl = document.createElement('table');
                tbl.style.width = '100%';
                tbl.className = "table table-bordered ";
                for (var i = 0; i < 1; i++) {
                    var tr = tbl.insertRow();
                    var td = tr.insertCell();
                    td.className = "name-col";
                    var tk = tr.insertCell();
                    tk.className = "score-col";
                }
                for (var k = 0; k < 1; k++) {
                    if (i == 0 && k == 0) {
                        break;
                    } else {
                        tk.append(highScore);
                        td.append(n);
                    }
                }
                div.appendChild(tbl);
            })
        })
}
scoreQuery();


