var urlStr = location.href;
var patts = [/index\.html/, /about\.html/, /shops\.html/, /contact\.html/];
var curPage = "";
for (var i =0; i < patts.length; i ++) {
  var matchs = patts[i].exec(urlStr);
  if (matchs) {
    curPage = matchs[0];
    break;
  }
}
if (!curPage) curPage = "index.html";
var imgUrl = [];
switch (curPage) {
  case "about.html":
    imgUrl = [
      './img/about/bg_01-e4570a4052fc.jpg',
      './img/about/txt_01_01-c1b1808117f9.png',
      './img/about/pic_01_01-811ecab2c02e.png',
    ];
    break;
  case "shops.html":
    imgUrl = [
      './img/shops/bg_01-8c27b6a44bdc.jpg',
      './img/shops/txt_01_01-8b3f9a083479.png',
    ];
    break;
  case "contact.html":
    imgUrl = [
      './img/contact/bg_01-9dbbe785e68a.jpg',
      './img/contact/txt_01_01-4c0ff03ca22e.png',
    ];
    break;
  default:
    imgUrl = [
      './img/home/bg_01-358ab3d0ed83.jpg',
      './img/home/txt_01_01-462e2b810ee5.png',
      './img/home/pic_01-9e2f41d3dbf4.png',
    ];
    break;
}
var $loading = $("#page-loading");
var $pageWrap = $("#page-wrap");
var pages = JSON.parse(sessionStorage.getItem('pages') || '[]');
if (!pages || !fn.contains(pages, curPage)) {
  $loading.css('display', 'block');
  fn.interval('#img_detection', 500, function () {
    var neededImg = [], count = 0;
    fn.forEach(imgUrl, function (url, i) {
      neededImg[i] = new Image();
      neededImg[i].src = url;
      if (neededImg[i].height) count++;
    });
    if (count == neededImg.length) {
      fn.interval('#img_detection').stop();
      onImgesLoaded();
      var hash = location.href.split('#')[1];
      if (hash) {
        $(document).scrollTop($('#' + hash).offset().top);
      }
      if (!fn.contains(pages, curPage)) {
        pages.push(curPage);
        sessionStorage.setItem('pages', JSON.stringify(pages));
      }
    }
  });
} else {
  onImgesLoaded();
}

function onImgesLoaded() {

  $pageWrap.css('display', 'block');
  $loading.css('display', 'none');
  var $win = $(window);
  var winH = $win.height();
  var winW = $win.width();
  var $seachIpt = $('.global-search input.search-input');
  $('.sec-01').css('height', winH);
  if (winH > winW) {
    $('html, body').css('width', '1140px');
  }
  $('.global-search').hover(function() {
    $seachIpt.focus();
  }, function() {
    $seachIpt.blur();
  });

  $(".bg-hover").mouseenter(function (e) {
    $(this).children("img.bg-hover-img").stop().animate({
      width: "110%",
      height: "110%",
      marginTop: "-4%",
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

  var $branchNav = $('.branches_nav li');
  $branchNav.each(function (i) {
    $(this).find('.undeline').width($(this).find('.menu_txt:nth-child(1)').width())
    $(this).click(function () {
      $branchNav.removeClass('active');
      $(this).addClass('active');
    });
  });

  new WOW().init();
};

function goTo(url, ancho) {
  location.href = url + '#' + (ancho || '');
}