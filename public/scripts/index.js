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
            window.location.href = "pages/main.html";
        } else {
            console.warn("No user is logged in.");
        }
    });
})

// When the user clicks the play button, it redirects them to the login screen
function playNow() {
    window.location.href = "pages/login.html";
}

// Change button image on / off hover
$(".play-button").mouseover(function() {
    $(".play-button").attr("src", "images/button-down.png");
})

$(".play-button").mouseleave(function() {
    $(".play-button").attr("src", "images/button-top.png");
})

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

// Banner size adjustment handlers for nav bar and window resize
$(window).on('resize', function(){
    adjustBannerSize();
});

$('.navbar').on('show.bs.collapse', function () {
    bannerNavOpen();
})

$('.navbar').on('hide.bs.collapse', function () {
    bannerNavClose();
})