//---------------------------------------------------
// replace the lines below with your own "firebaseConfig"
// key value pairs
//--------------------------------------------------- 

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB2BeahK930jblXk15rTGW7RihvRUon3us",
  authDomain: "comp1800project.firebaseapp.com",
  projectId: "comp1800project",
  storageBucket: "comp1800project.appspot.com",
  messagingSenderId: "529979286451",
  appId: "1:529979286451:web:6e90ff8a1f479eb662e1c6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();