"use strict";

window.isMobile = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

window.detectIE = function (){var n=window.navigator.userAgent,r=n.indexOf("MSIE ");if(r>0)return parseInt(n.substring(r+5,n.indexOf(".",r)),10);var e=n.indexOf("Trident/");if(e>0){var i=n.indexOf("rv:");return parseInt(n.substring(i+3,n.indexOf(".",i)),10)}var t=n.indexOf("Edge/");return t>0?parseInt(n.substring(t+5,n.indexOf(".",t)),10):!1}

$.get('https://pcustoms.lackneets.tw/version/', function(v){
  $('#version-pcustoms').text(v);
})

$(function(){

  // var controller = new ScrollMagic.Controller();

  // // Toggle Header Hero
  // new ScrollMagic.Scene({
  //   triggerElement: '.main-container',
  //   triggerHook: 'onEnter',
  //   offset: Math.min(window.screen.availHeight*0.35, 400)
  // })
  // .setClassToggle("body", "skip-hero")
  // .addTo(controller);


  // if(! isMobile() ){
  //   var animate = new TimelineMax()
  //   .insert(TweenMax.fromTo('.background', 1, {backgroundPositionY: '0px'}, {backgroundPositionY: '-30px'}))
  //   .insert(TweenMax.fromTo('.background-stage', 1, {y: '0px'}, {y: '-30px'}))
  //   .insert(TweenMax.fromTo('.background-glass', 1, {y: '0px'}, {y: '-200px'}))
  //   .insert(TweenMax.fromTo('.sign .sm-wrap', 1, {y: '0px'}, {y: '-15px'}))
  //   .insert(TweenMax.fromTo('.social-links', 1, {y: '0px', opacity: 1}, {y: '-200px', opacity: 0}))


  //   new ScrollMagic.Scene({
  //     triggerElement: '.main-container',
  //     triggerHook: 'onEnter',
  //     duration: 800
  //   })
  //   .setTween(animate)
  //   // .addIndicators({name: "main-header"})
  //   .addTo(controller);
  // }

});

window.heroBackgroundImage = null;
window.generateRainGlass = function(image){
  if(!image || !$('.background-glass')[0]) return;
  var engine = new RainyDay({
    image: image,
    width: image.clientWidth * .8,
    height: image.clientHeight * .8,
    parentElement: $('.background-glass')[0],
    gravityAngle: Math.PI * 0.7
  });
  engine.rain([ [1, 3, 10] ]);
  engine.rain([ [1, 2, 0.8], [3, 3, 0.2], [8, 1, 0.05] ], 120);
  $('.background-glass').append(image);
};

// Boot
$(function(){

  var loaderHero = false;
  // var loaderBrowserclass = false;

  (function loaderLoop(){
    setTimeout(function(){
      // var loaderBrowserclass = !!BrowserClass;
      if(loaderHero /*&& loaderBrowserclass*/){
        setTimeout(function(){
          $('body').addClass('init');
          $(document).scrollTop(0);
          rotateAirplanes();
        }, 600);
      }else{
        loaderLoop();
      }
    }, 50);
  })();

  onBackgroundLoad(document.getElementsByClassName('background')[0], function(){
    loaderHero = true;
    window.heroBackgroundImage = this;
    // isMobile() || detectIE() || window.generateRainGlass(window.heroBackgroundImage);
    // isMobile() || detectIE() || effectLighting();
  });

  function onBackgroundLoad(element, callback){
    var bgsrc = getComputedStyle(element).backgroundImage.replace(/url\("?(.+?)"?\)/, '$1').replace('b.jpg', 'm.jpg');
    var el = document.createElement('img');
    // el.style.display = 'none';
    el.crossOrigin = 'anonymous';
    el.width  = 1920;
    el.height = 1080;
    el.addEventListener('load', function(){
      callback && callback.call(el, bgsrc);
    });
    el.src = bgsrc;
    el.style.opacity = 0;
    el.style.position = 'fixed';
    el.style.maxWidth = '100%'
    document.body.appendChild(el);
  }


  $.fn.rotateClass = function(classes) {
    var $set = this.each(function () {
      var $this = $(this);
      var index = (($this.data("currentClassIndex")) ? $this.data("currentClassIndex") : 0) % classes.length;

      $this.removeClass(classes.join(" "))
      .addClass(classes[index])
      .data("currentClassIndex", ++index);
    });

    return $set;
  }

  var airplanes = ['plane-ci', 'plane-br', 'plane-mm'];

  shuffle(airplanes);

  function shuffle (array) {
    var i = 0
    , j = 0
    , temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }

  function rotateAirplanes(){
    $('body').rotateClass(airplanes);
    setTimeout(rotateAirplanes, 40 * 1000);
  }

});


(function(){

  !function(){function n(n,t,e){n.addEventListener?n.addEventListener(t,e,!1):n.attachEvent&&n.attachEvent("on"+t,e)}window.ready=window.onReady=function(t){"complete"==document.readyState?t():n(window,"load",t)}}();

  window.requestAnimationFrame = function(){
    return (
      window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback){
        window.setTimeout(callback, 1000 / 60);
      }
    );
  }();

  var meter;
  var fpsHistory = [];

  function tick(){
    window.requestAnimationFrame(function(){
      meter.tick();
      tick();
      // console.log(meter.fps)
    });
  }

  function detectSlowPerformance(){
    return setTimeout(function(){
      if(document.hidden){
        return window.requestAnimationFrame(function(){
          detectSlowPerformance();
        });
      }else{
        if(meter.fps < 40 && ! document.hidden ){
          $('html').addClass('slow-performance');
        }
        if(meter.fps >= 60){
          $('html').addClass('high-performance');
          isMobile() || detectIE() || (window.heroBackgroundImage && window.generateRainGlass(window.heroBackgroundImage));
          isMobile() || detectIE() || effectLighting();
        }
      }
    }, 2000);
  }

  ready(function(){
    meter = new FPSMeter(document.getElementById('fpsmeter'), {
      smooth: 30,
      theme: 'transparent'
    });
    tick();

    detectSlowPerformance();

  });

})();

