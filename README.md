## Globetrotter

- [General info](#general-info)
- [Technologies](#technologies)
- [Contents](#content)
- [Contributors](#contributors)

## General Info

Globetrotter is an incremental exercise game. Incremental games are games where the user constantly has 
something to progress towards, usually in an exponential way. For an example of a similar game, see
[Cookie Clicker](https://orteil.dashnet.org/cookieclicker/).

The motivation behind this design is that our surveys results showed that motivation is the primary 
reason that people do not get the exercise they want. Incremental games are great at motivating
people since there's always "just one more" thing you can achieve. By linking progress in the game
to walking, we can motivate people to walk more.

## Technologies

Technologies used for this project:

- HTML, CSS
- JavaScript
- jQuery
- Bootstrap
- Firebase
- Geolocation API
- Google Maps API
- Directions API
- Distance Matrix API

## Content

Content of the project folder:

```
 Top level of project folder:
├── .github                  # Github automatic deployment information
├── public                   # Folder containing the project files
├── .gitignore               # Git ignore file
├── firebase.json            # Firebase hosting information
└── README.md

It has the following subfolders and files:
├── images                   # Folder for images
    /banner-text.png      
    /banner.png
    /bicycle.png
    /button-down.png
    /button-top.png
    /car.png
    /destination-marker.png
    /favicon-32x32.png
    /logo.png
    /plane.png
    /position-marker.png
    /skateboard.png
    /spaceship.png
    /texture.png
    /train.png
├── scripts                  # Folder for scripts
    /distance-functions.js
    /exercise-settings.js
    /exercise.js
    /feedback.js
    /firebase-api.js
    /game.js
    /game-settings.js
    /goal.js
    /index.js
    /jquery.path.js
    /login.js
    /logout.js
    /quote.js
    /stats-settings.js
    /stats.js
    /suggestion.js
    /upload-profilePic.js
├── styles                   # Folder for styles
    /bootstrap-color.css
    /exercise.css
    /goal.css
    /index.css
    /layout.css
    /main.css
    /profile.css
    /stats.css
├── pages                    # Folder for html pages
    /404.html                # 404 page if page doesn't exist
    /bugreport.html          # place for user to submit bug reports
    /exercise.html           # exercise session page to start a new exercise session
    /feedback.html           # feedback landing page where user can select what type of feedback to submit
    /gamesuggestion.html     # place for user to submit game suggestions
    /goal.html               # goal page with leaderboard and step goal
    /login.html              # Allows the user to log in
    /main.html               # the main gameplay page
    /profile.html            # profile page with quote, profile picture, and leaderboard
    /stats.html              # statistics page to review previous session stats         
    /submissionreceived.html # page displayed after bug report or suggestion submission
├── index.html               # the initial page of the app
├── 404.html                 # 404 page if page doesn't exist
        

```

## Contributors

**Kyle Burnette**
- The main gameplay in main.html
- user feedback and bug report submission in bugreport.html, feedback.html, gamesuggestion.html, and submissionreceived.html.
- Implemented distance and movement calculation  

**Jacky Tsoi**
- landing page on index.html
- graphical elements
- live map, including tracking and bonus score in exercise.html
- statistics and calculation formulas in stats.html.  
- colour palette and ui

**Alex Wong**
- Profile picture
- daily quotes
- global leaderboard in profile.html
- goal tracking in goal.html.
