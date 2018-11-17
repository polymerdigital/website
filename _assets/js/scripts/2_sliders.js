//Sliders
if($('.testimonials__slide').length > 1) {
  $('.testimonials__slider').slick({
    dots: false,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    pauseOnHover: false,
    initialSlide: 0,
    edgeFriction: .08
  });
}
