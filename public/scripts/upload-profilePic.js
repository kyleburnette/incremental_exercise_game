// Default picture for user without a custom profile picture.
const defaultPic = "https://firebasestorage.googleapis.com/v0/b/comp1800project.appspot.com/o/images%2Fprofile_pic.jpg?alt=media&token=fe2e2a67-f843-4b28-b83e-7516e584d689";

var user = null;
/**  
 * when User is logged in, listens for file upload
 * @param user uploads user custom photo for profile picture.
 *
 */
firebase.auth().onAuthStateChanged(function (user) {
    user = firebase.auth().currentUser;
    if (user != null) {
        // User is signed in.
        user.providerData.forEach(function () {});

        function uploadUserProfilePic() {
            // Let's assume my storage is only enabled for authenticated users 
            // This is set in your firebase console storage "rules" tab
            firebase.auth().onAuthStateChanged(function (user) {
                var fileInput = document.getElementById("mypic-input"); // pointer #1
                const image = document.getElementById("mypic-goes-here"); // pointer #2
                // listen for file selection
                fileInput.addEventListener('change', function (e) {
                    var file = e.target.files[0];
                    var blob = URL.createObjectURL(file);
                    image.src = blob; // display this image
                    //store using this name
                    var storageRef = storage.ref("images/" + user.uid + ".jpg");
                    //upload the picked file
                    storageRef.put(file)
                        .then(function () {
                            console.log('Uploaded to Cloud Storage.');
                        })
                    //get the URL of stored file
                    storageRef.getDownloadURL()
                        .then(function (url) { // Get URL of the uploaded file
                            console.log(url); // Save the URL into users collection
                            db.collection("user").doc(user.uid).set({
                                    "profilePic": url
                                }, {
                                    merge: true
                                })
                                .then(function () {})
                        })
                })
            })
        }
        uploadUserProfilePic();

    } else {
        // No user is signed in.
        console.warn("User is not logged in")
    }
})

/**  
 * Displays User Profile Pic
 * Appends the picUrl to html
 */
function displayUserProfilePic() {
    //console.log("Display Pic");
    firebase.auth().onAuthStateChanged(function (user) { //get user object
        db.collection("user").doc(user.uid) //use user's uid
            .get() //READ the doc
            .then(function (doc) {
                var picUrl = doc.data().profilePic; //extract pic url
                $("#mypic-goes-here").attr("src", picUrl);
            })
    })
}
displayUserProfilePic();

/**  
 * Write the profilePic field for user, when they first visit the page.
 *
 */
function writeUserProfilePicField() {
    var defaultPicForUser = defaultPic;
    var user = firebase.auth().currentUser;
    var picture = db.collection("user").doc(user.uid);
    picture.get().then((doc) => {
        if (doc.exists) {
            defaultPicForUser = doc.data().goal;
        } else {
            picture.set({
                profilePic: defaultPicForUser
            }, {
                merge: true
            })
        }
    }).catch((error) => {
        console.warn("Error getting document:", error);
    });
}



/**  
 * Loads the default profile picture if no user uploaded picture is found.
 *
 */
function defaultProfilePic() {
    var picUrl = defaultPic;
    var user = firebase.auth().currentUser;
    var picture = db.collection("user").doc(user.uid);
    picture.get().then((doc) => {
        if (doc.exists) {
            picUrl = doc.data().profilePic;
            $("#mypic-goes-here").attr("src", picUrl);

        } else {
            picUrl = defaultPic;
            $("#mypic-goes-here").attr("src", picUrl);
        }
    }).catch((error) => {
        console.warn("Error getting document:", error);
    });
}

/**  
 * Verfies the User
 * default profile pic and writing user profile pic when page loads.
 * Redirects to User to login.html if no user is logged in.
 */
$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedInUser = user;
            defaultProfilePic();
            writeUserProfilePicField();
        } else {
            console.warn("No user detected!");
            window.location.href = "login.html";
        }
    });
});

var fileInput = document.getElementById("mypic-input");
const preview = document.getElementById("preview-image");

/**  
 * Uploaded profile pic 
 * shows a preview of the profile picture before uploading.
 */
function uploadUserProfilePic() {
    // Let's assume my storage is only enabled for authenticated users 
    // This is set in your firebase console storage "rules" tab

    firebase.auth().onAuthStateChanged(function (user) {

        // listen for file selection
        fileInput.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var blob = URL.createObjectURL(file);
            preview.src = blob; // display this image
            $("#showImage").modal("toggle");
        })
    })
}
uploadUserProfilePic();

/**  
 * Confirmation of the preview photo before upload.
 *
 */
function confirmProfilePic() {
    //store using this name
    var storageRef = firebase.storage().ref("images/" + user.uid + ".jpg");

    //upload the picked file
    storageRef.put(file)
        .then(function () {})

    //get the URL of stored file
    storageRef.getDownloadURL()
        .then(function (url) { // Get URL of the uploaded file
            console.log(url); // Save the URL into users collection
            db.collection("user").doc(user.uid).set({
                    "profilePic": url
                }, {
                    merge: true
                })
                .then(function () {})
        })
    window.location.reload();
}
