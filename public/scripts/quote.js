// picks a random quote from quote DB and displays for User.
function displayQuote() {
    db.collection("messages")
        .where("position", ">", Math.floor(Math.random() * 1000))
        .limit(1)
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var n = doc.data().message;
                var messagesString = "<p> " + n + "</p";
                $("#quote-go-here").append(messagesString);
            })
        })
}
displayQuote();
