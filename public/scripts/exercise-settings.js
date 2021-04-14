// Position tracking options
var options = {
    enableHighAccuracy: true,
    timeout: 7500,
    maximumAge: 0
};

// Tracking rates
var pollingRate = 1000; // The rate at which to poll the user's location (in ms)
var updateRate = 20000; // The rate at which to write to the database (in ms)

// Threshold options
const minAccuracy = 1000; // tracks inaccuracy
const withinDestination = 25; // in meters
const flagThreshold = 30; // maximum of 30 flags before session force ends
const maxDistance = 10000; // max distance travelled in a second
const requiredTime = 0;

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
var inventory = {skateboard: 0,  bicycle: 0, car: 0, train: 0, plane: 0, spaceship: 0};
var stepsPerSecond = {skateboard: 1, bicycle: 10, car: 50, train: 100, plane: 500, spaceship: 1000};

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
const minMultiplier = 0.25;
const maxMultiplier = 3;
var allowedTimeMultiplier = 1;
var durationMultiplier = 1;

// Session settings and tracking variables
var updateCrd = true;
var routeOption = "off";
var routeError = false;
var trackingState = false;
var destinationSet = false;
var destinationLat = 0;
var destinationLng = 0;

// Visual feedback for duration of the user's exercise session
var duration;
var timer = 0;

// Map elements and file path for custom images
var positionMarker;
var destinationMarker;
var directionsService;
var directionsDisplay;
var infoWindow;
const destination_marker = "../images/destination-marker.png";
const location_marker = "../images/position-marker.png";

// User path tracker to store coordinates for Polyline
var userPath;
var pathCoordinates = [];