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

/* Reserved for future use if need to add new quotes.
function writeQuotes() {
  var messageRef = db.collection("messages");
  messageRef.add({
    position: Math.floor(Math.random() * 1000),
    message: "If people are doubting how far you can go, go so far that you can’t hear them anymore.” – Michele Ruiz",
  });
  messageRef.add({
    position: Math.floor(Math.random() * 1000),
    message: "live, laugh, love yourself",
  });
}
writeQuotes(); 
*/