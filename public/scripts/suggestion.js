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
        window.location.href = "submissionreceived.html";
    });
}

function getFeedback() {
    document.getElementById("button-submit").addEventListener('click', function () {
        var feedback = document.getElementById("feedback-input").value;
        console.log(feedback);
        writeFeedback(feedback);
    });
}

getFeedback();