// Adjust banner text
function adjustBannerSize() {
    var textHeight = $('.banner-txt').height();
    var bannerHeight = $('.banner-img').height();
    var navHeight = $('.navbar').height();
    var topHeight = (bannerHeight - textHeight) / 2;
    var top = topHeight + navHeight + 13;
    $('.banner-txt').css({
        'top' : top
    })
}
adjustBannerSize();

$(document).ready(function () {
    adjustBannerSize();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loggedInUser = user;
            console.log("Logged in as", loggedInUser.displayName,
                "and will redirecting to home.");
            window.location.href = "main.html";
        } else {
            console.log("No user is logged in.");
        }
    });
})

$(window).on('resize', function(){
    adjustBannerSize();
});

// When the user clicks the play button, it redirects them to the login screen
function playNow() {
    window.location.href = "login.html";
}

// Adjusts banner text when navbar opens
function bannerNavOpen() {
    var textHeight = $('.banner-txt').height();
    var bannerHeight = $('.banner-img').height();
    var navHeight = $('.navbar').height();
    var topHeight = (bannerHeight - textHeight) / 2;
    var top = topHeight + navHeight + 93;
    $('.banner-txt').animate({
        'top' : top
    }, 200, 'linear')
}

// Adjusts banner text when navbar closes
function bannerNavClose() {
    var textHeight = $('.banner-txt').height();
    var bannerHeight = $('.banner-img').height();
    var navHeight = $('.navbar').height();
    var topHeight = (bannerHeight - textHeight) / 2;
    var top = topHeight + navHeight - 67;
    $('.banner-txt').animate({
        'top' : top
    }, 200, 'linear')
}

$('.navbar').on('show.bs.collapse', function () {
    bannerNavOpen();
})

$('.navbar').on('hide.bs.collapse', function () {
    bannerNavClose();
})