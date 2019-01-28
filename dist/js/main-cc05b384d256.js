$(function () {
  var $win = $(window);
  $('.sec-01').css('height', $win.height());

  $(".bg-hover").mouseenter(function (e) {
    $(this).children("img.bg-hover-img").stop().animate({
      width: "110%",
      height: "110%",
      marginTop: "-5%",
      marginLeft: "-5%"
    }, "easy-in-out");
    e = e || window.event;
    var angle = direction(e, this);
    mouseEvent(angle, this, "enter");
  }).mouseleave(function (e) {
    $(this).children("img.bg-hover-img").stop().animate({
      width: "100%",
      height: "101%",
      marginTop: "0",
      marginLeft: "0"
    }, "easy-in-out");
    e = e || window.event;
    var angle = direction(e, this);
    mouseEvent(angle, this, "leave");
  });

});