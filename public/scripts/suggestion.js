//writes user's feedback to the database
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

//retrieves user's feedback from the form
function getFeedback() {
    document.getElementById("button-submit").addEventListener('click', function () {
        var feedback = document.getElementById("feedback-input").value;
        writeFeedback(feedback);
    });
}

getFeedback();