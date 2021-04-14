/**  
 * Reads database of messsages
 * Picks at random message and displays for user.
 * Picks a new message everytime the page reloads.
 */
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
