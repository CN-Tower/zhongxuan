var urlStr = location.href;
var patts = [/index\.html/, /about\.html/, /shops\.html/, /contact\.html/];
var curPage = "";
for (var i in patts) {
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
      './img/about/bg_01.jpg',
      './img/about/txt_01_01.png',
      './img/about/pic_01_01.png',
    ];
    break;
  case "shops.html":
    imgUrl = [
      './img/shops/bg_01.jpg',
      './img/shops/txt_01_01.png',
    ];
    break;
  case "contact.html":
    imgUrl = [
      './img/contact/bg_01.jpg',
      './img/contact/txt_01_01.png',
    ];
    break;
  default:
    imgUrl = [
      './img/home/bg_01.jpg',
      './img/home/txt_01_01.png',
      './img/home/pic_01.png',
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
  $barnchsNavItems.each(function (i) {
    $(this).click(function () {
      $barnchsNavItems.removeClass('active');
      $(this).addClass('active');
    });
  });
};

function goTo(url, ancho) {
  location.href = url + '#' + (ancho || '');
}