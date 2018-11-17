// Menu Click
$('.main-header__menu').on("click", function(e){
  $(this).toggleClass('active');
  $('.main-header__links').toggleClass('active');
  e.preventDefault();
  mobileNavHeight();
});

// Menu Click
$('.with-dropdown').on("click", function(e){
  $(this).toggleClass('active');
  $(this).next('.dropdown').toggleClass('active');
  e.preventDefault();
  mobileNavHeight();
});


//Mobile Height Overflow
function mobileNavHeight () {
  var navHeight = $('.main-header__links.active').outerHeight() + 62;
  var windowHeight = $(window).height();
  if (navHeight > windowHeight) {
    $('.main-header').addClass("overflow");
  } else {
    $('.main-header').removeClass("overflow");
  }
}
$(window).on("resize", mobileNavHeight); //Check window width on resize
$(window).triggerHandler("resize"); // Initial window check
