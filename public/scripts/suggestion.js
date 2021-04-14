/**
 * Writes user's feedback to the database.
 * 
 * @param text - the contents of the user's feedback.
 */
function writeFeedback(text) {
    var writeSuggestion = db.collection("suggestions");

    var user = firebase.auth().currentUser;
    writeSuggestion.add({
        userDisplayName: user.displayName,
        userEmail: user.email,
        userID: user.uid,
        feedback: text,
        timestamp: Date.now().toString()
    }).then(function () {
        window.location.href = "submission-received.html";
    });
}

/**
 * Writes user's feedback to the database.
 * 
 * @param text - the contents of the user's feedback.
 */
function getFeedback() {
    document.getElementById("button-submit").addEventListener('click', function () {
        var feedback = document.getElementById("feedback-input").value;
        writeFeedback(feedback);
    });
}

getFeedback();