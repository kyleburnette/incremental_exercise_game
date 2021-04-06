/*
        function readQuote() {
            db.collection("messages").doc("monday")
                .onSnapshot(function (snap) {
                    console.log(snap.data()); //.data() returns data object
                    document.getElementById("quote-goes-here").innerHTML = snap.data().message;
                    //using vanilla javascript
                    //$('#quote-goes-here').text(c.data().quote);                             //using jquery object dot notation
                    //$("#quote-goes-here").text(c.data()["quote"]);                          //using json object indexing
                    // delete after getDate() is implemented;
                })
        }
        readQuote();
*/

function displayQuote() {
    db.collection("messages")
        .where("position", ">", Math.floor(Math.random() * 1000))
        .limit(1)
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var n = doc.data().message;
                console.log(n);
                var messagesString = "<p> " + n + "</p";
                $("#quote-go-here").append(messagesString);
            })
        })
}
displayQuote();