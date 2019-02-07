$(function () {

  var $win = $(window);
  $('.sec-01').css('height', $win.height());

  new WOW().init();

  $(".bg-hover").mouseenter(function (e) {
    $(this).children("img.bg-hover-img").stop().animate({
      width: "110%",
      height: "110%",
      marginTop: "-5%",
      marginLeft: "-5%"
    }, "easy-in-out");
  }).mouseleave(function (e) {
    $(this).children("img.bg-hover-img").stop().animate({
      width: "100%",
      height: "101%",
      marginTop: "0",
      marginLeft: "0"
    }, "easy-in-out");
  });

  var $barnchsNavItems = $('.branchs_nav').children()
  $barnchsNavItems.each(function(i) {
    $(this).click(function() {
      $barnchsNavItems.removeClass('active');
      $(this).addClass('active');
    });
  });
});