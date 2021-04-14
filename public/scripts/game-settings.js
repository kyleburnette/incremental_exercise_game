
//The rate at which to write to the database (in ms)
var updateRate = 20000;

//The rate at which to poll the user's location (in ms)
var pollingRate = 1000;

//The minimum geolocation accuracy to count as a valid reading (in meters)
var maxAccuracy = 5;

//The minimum speed that counts as walking (in meters per second)
var minimumWalkingSpeed = 0.5

//The exponential factor used to calculate costs.
var growthRate = 0.15;

//When true, user will always "be walking" for development and demo purposes.
var debug = true;

//Holds base prices for items as well as their bonus steps per second.
stepsPerSecond = {skateboard: 1, bicycle: 10, car: 50, train: 100, plane: 500, spaceship: 1000};
basePrices = {skateboard: 10, bicycle: 100, car: 500, train: 1000, plane: 5000, spaceship: 10000};