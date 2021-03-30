// Position tracking options
var options = {
    enableHighAccuracy: true,
    timeout: 7500,
    maximumAge: 0
};

// Keep the device type to verify if the user can use exercise.html
var deviceType = "Mobile";

// Flag counter tracking if the user is in a vehicle
var flagCounter = 0;


// Sets variable to the user on firebase
var loggedInUser = firebase.auth().currentUser;

// Store most recently tracked coordinate
var crd = {
    'lat': 0,
    'lng': 0
};
var previousCrd = null;

// Store the coordinate values for start and destination
var startPosition = {
    'latitude': 0,
    'longitude': 0
};
var destinationPosition = {
    'latitude': 0,
    'longitude': 0
};

// Create an inventory and save value of each field to calculate bonus score
var inventory = { bicycle: 0, car: 0, plane: 0, skateboard: 0, spaceship: 0, train: 0 };
var stepsPerSecond = {skateboard: 1, bicycle: 2, car: 5, train: 8, plane: 9, spaceship: 10};

// Instantiate statistics for post-exercise session
var dateObj = new Date(); // start date
var endTime = new Date(); // end session date
var totalTime = 0; // in milliseconds
var totalDistance = 0; // in meters
var totalSteps = 0; // 
var totalMinCalories = 0; // (totalSteps / 100) * 3
var totalMaxCalories = 0; // (totalSteps / 100) * 4
var savedScore; // retrieved from database
var userScore = 0; // calculated with multiplier

// Post-session feedback and adjustments variables
var difficultyRating;
var durationRating;
var recentFeedback

// Default score multipliers
var allowedTimeMultiplier = 1;
var durationMultiplier = 1;

// Session settings and tracking variables
var routeOption = "off";
var routeError = false;
var trackingState = false;
var destinationSet = false;
var destinationLat = 0;
var destinationLng = 0;

// Visual feedback for duration of the user's exercise session
var duration;
var timer = 0;

// Map markers and file path for custom images
var positionMarker;
var destinationMarker;
const destination_marker = "images/destination_marker.png";
const location_marker = "images/position_marker.png";

// User path tracker to store coordinates for Polyline
var userPath;
var pathCoordinates = [];