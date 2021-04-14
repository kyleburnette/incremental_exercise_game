/**
 * Writes user's bug report to the database.
 * 
 * @param text - the contents of the user's feedback.
 */
function writeFeedback(text) {
    var writeSuggestion = db.collection("bugreports");

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
 * Retrieves user's bug report from the form
 */
function getFeedback() {
    document.getElementById("button-submit").addEventListener('click', function () {
        var feedback = document.getElementById("feedback-input").value;
        writeFeedback(feedback);
    });
}

getFeedback();