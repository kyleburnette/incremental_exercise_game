const defaultPic = "https://firebasestorage.googleapis.com/v0/b/comp1800project.appspot.com/o/images%2Fprofile_pic.jpg?alt=media&token=fe2e2a67-f843-4b28-b83e-7516e584d689";

var user = null;
// Checks if User is logged in.
firebase.auth().onAuthStateChanged(function (user) {
    user = firebase.auth().currentUser;
    if (user != null) {
        // User is signed in.
        user.providerData.forEach(function (profile) {
            // console.log("Sign-in provider: " + profile.providerId);
            // console.log("  Provider-specific UID: " + profile.uid);
            // console.log("  Name: " + profile.displayName);
            // console.log("  Email: " + profile.email);
            // console.log("  Photo URL: " + profile.photoURL);
            // console.log("  uid " + user.uid);
        });

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
                                .then(function () {
                                    console.log('Added Profile Pic URL to Firestore.');
                                })
                        })
                })
            })
        }
        uploadUserProfilePic();

    } else {
        // No user is signed in.
        console.log("User is not logged in")
    }
})

// reads profilePic and displays image.
function displayUserProfilePic() {
    //console.log("Display Pic");
    firebase.auth().onAuthStateChanged(function (user) { //get user object
        db.collection("user").doc(user.uid) //use user's uid
            .get() //READ the doc
            .then(function (doc) {
                var picUrl = doc.data().profilePic; //extract pic url

                // use this line if "mypicdiv" is a "div"
                //$("#mypicdiv").append("<img src='" + picUrl + "'>")

                // use this line if "mypic-goes-here" is an "img" 
                $("#mypic-goes-here").attr("src", picUrl);
            })
    })
}
displayUserProfilePic();

// Initializes the User profilePic field when user visits profile.html 1st time.
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



// Default Profile Picture of User if none is uploaded.
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
            //console.log("No such document!");
            $("#mypic-goes-here").attr("src", picUrl);
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

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

// Uploads User Profile Picture in seperate window.
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

// Confirms profile picture.
function confirmProfilePic() {
    //store using this name
    var storageRef = firebase.storage().ref("images/" + user.uid + ".jpg");

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
                .then(function () {
                    console.log('Added Profile Pic URL to Firestore.');
                })
        })
    window.location.reload();
}

$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedInUser = user;
            console.log("Logged in as", loggedInUser.displayName);

        } else {
            console.warn("No user detected!");
            window.location.href = "login.html";
        }
    });
});