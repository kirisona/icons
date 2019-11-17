$(".menu").on("click", function() {
  $(".header__list").toggleClass("active");
});

$(".slider").slick({
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true
      }
    }
  ]
});
