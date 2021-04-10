// Sets variable to the user on firebase
var loggedInUser = firebase.auth().currentUser;
var currentID;

// Store session statistics
var sessionDate;
var time;
var distance;
var steps;
var minCalories;
var maxCalories;

// Store the coordinate values for start and destination
var startPosition = {
    'latitude': 0,
    'longitude': 0
};
var destinationPosition = {
    'latitude': 0,
    'longitude': 0
};

// Map elements and file path for custom images
var positionMarker;
var destinationMarker;
const destination_marker = "images/destination-marker.png";
const location_marker = "images/position-marker.png";

// User path tracker to store coordinates for Polyline
var userPath;
var pathCoordinates = [];