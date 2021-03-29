firebase.auth().onAuthStateChanged(function (user) {
  var user = firebase.auth().currentUser;
  if (user != null) {
    // User is signed in.
    user.providerData.forEach(function (profile) {
      console.log("Sign-in provider: " + profile.providerId);
      console.log("  Provider-specific UID: " + profile.uid);
      console.log("  Name: " + profile.displayName);
      console.log("  Email: " + profile.email);
      console.log("  Photo URL: " + profile.photoURL);
      console.log("  uid " + user.uid);
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
              db.collection("users").doc(user.uid).update({
                  "profilePic": url
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
    console.log("user is not logged in")
  }
});

/* var fileInput = document.getElementById("mypic-input");
const preview = document.getElementById("preview-image");

function uploadUserProfilePic() {
  // Let's assume my storage is only enabled for authenticated users 
  // This is set in your firebase console storage "rules" tab

  firebase.auth().onAuthStateChanged(function (user) {

      // listen for file selection
      fileInput.addEventListener('change', function (e) {
          var file = e.target.files[0];
          var blob = URL.createObjectURL(file);
          preview.src = blob;            // display this image
          $("#showImage").modal("toggle");
      })
  })
}
uploadUserProfilePic();

function confirmProfilePic() {
  //store using this name
  var storageRef = firebase.storage().ref("images/" + users.uid + ".jpg"); 
            
  //upload the picked file
  storageRef.put(file) 
      .then(function(){
          console.log('Uploaded to Cloud Storage.');
      })

  //get the URL of stored file
  storageRef.getDownloadURL()
      .then(function (url) {   // Get URL of the uploaded file
          console.log(url);    // Save the URL into users collection
          db.collection("users").doc(user.uid).set({
              "profilePic": url
          },{
            merge: true
          })
          .then(function(){
              console.log('Added Profile Pic URL to Firestore.');
          })
      })
      window.location.reload();
} 
confirmProfilePic();

function displayUserProfilePic() {
    console.log("Displaying profile picture");
    firebase.auth().onAuthStateChanged(function (user) {      //get user object
        db.collection("users").doc(user.uid)                  //use user's uid
            .get()                                            //READ the doc
            .then(function (doc) {
                var picUrl = doc.data().userPic;           //extract pic url
                //if (profilePic === null){
                  //console.log("profile pic is not null")
                //}
								// use this line if "mypicdiv" is a "div"
                //$("#mypicdiv").append("<img src='" + picUrl + "'>")
                
								// use this line if "mypic-goes-here" is an "img" 
								$("#mypic-goes-here").attr("src", profileUrl);
            })
    })
}
displayUserProfilePic();

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
}); */