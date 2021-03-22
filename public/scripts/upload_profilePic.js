firebase.auth().onAuthStateChanged(function(user) {
    var user = firebase.auth().currentUser;
    if (user != null) {
      // User is signed in.
      user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
      });
    } else {
      // No user is signed in.
      console.log("user is not logged in")
    }
  });

function uploadUserProfilePic() {
    // Let's assume my storage is only enabled for authenticated users 
    // This is set in your firebase console storage "rules" tab

    firebase.auth().onAuthStateChanged(function (user) {
        var fileInput = document.getElementById("mypic-input");   // pointer #1
        const image = document.getElementById("mypic-goes-here"); // pointer #2

        // listen for file selection
        fileInput.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var fileImg = URL.createObjectURL(file);
            image.src = fileImg;            // display this image

            //store using this name
            var storageRef = storage.ref("images/" + user.uid + ".jpg"); 
            
            //upload the picked file
            storageRef.put(file) 
                .then(function(){
                    console.log('Uploaded to Cloud Storage.');
                })

						//get the URL of stored file
            storageRef.getDownloadURL()
                .then(function (url) {   // Get URL of the uploaded file
                    console.log(url);    // Save the URL into users collection
                    db.collection("users").doc(user.uid).update({
                        "profilePic": url
                    })
                    .then(function(){
                        console.log('Added Profile Pic URL to Firestore.');
                    })
                })
        })
    })
}
uploadUserProfilePic();

function displayUserProfilePic() {
    console.log("displaying profile pic");
    firebase.auth().onAuthStateChanged(function (user) {      //get user object
        db.collection("users").doc(user.uid)                  //use user's uid
            .get()                                            //READ the doc
            .then(function (doc) {
                var picUrl = doc.data().profilePic;           //extract pic url

								// use this line if "mypicdiv" is a "div"
                //$("#mypicdiv").append("<img src='" + picUrl + "'>")
                
								// use this line if "mypic-goes-here" is an "img" 
								$("#mypic-goes-here").attr("src", picUrl);
            })
    })
}
displayUserProfilePic();