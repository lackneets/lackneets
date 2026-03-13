"use strict";


window.isMobile = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

window.isIOS = function(){
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

window.canPlayM4V = function(){
  var vid = document.createElement('video');
  return !!(vid.canPlayType && vid.canPlayType('video/mp4').match(/probably|maybe/));
}

$.extend($.lazyLoadXT, {
  throttle: 2000,
  edgeY: isMobile() ? 200 : 600,
  updateEvent: 'load orientationchange resize userscroll'
});

// external links https://gist.github.com/lackneets/ad56e1416325a5209c9b
$(document).on('mouseenter touchstart', 'a[href]:not([target])', function(){
  if(this.getAttribute('href').match(/^(https?:)?\/\//) && !this.getAttribute('href').match(location.host)){
    this.setAttribute('target', '_blank');
  }
});

$(function(){

  if(isMobile()){ 
    $('.pc-only').hide();
  }

  $('video').each(function(){
    $('<span class="video-play">').insertAfter(this);
  })
  $('video').on('play', function(){ $(this).closest('.entry').toggleClass('video-playing', true) });
  $('video').on('stop pause', function(){ $(this).closest('.entry').toggleClass('video-playing', false) })
  $('.video-play').on('click', function(){
    $(this).closest('.entry').find('video')[0].play();
    $(this).closest('.entry').find('video')[0].currentTime = 0;
    $(this).closest('.entry').find('video')[0].volume = 1;
  });

  if(isIOS()){
    $('.video-play').hide();
    $('video').each(function(){
      this.controls = true;
    })
  }
  

  if(!canPlayM4V()){
    $('.video-play').remove();
    $('video source').remove();
    $('video').each(function(){
      this.autoplay = false;
      this.controls = false;
    });
  }

  function xxmail(){
    return "\x6C\x61\x63\x6B\x6E\x65\x65\x74\x73\x40\x67\x6D\x61\x69\x6C\x2E\x63\x6F\x6D";
  }

  $('.my-email').attr('href', 'mailto:'+xxmail()).append(xxmail());

  $('.owl-carousel').owlCarousel({
    //margin: 10,
    loop: true,
    itemsCustom : [
      [0, 1],
      [600, 1],
      [720, 2]
    ],
    // items: 2,
    // itemsDesktop : [1200,2],
    // itemsDesktopSmall : [780,2],
    slideSpeed: 600,
    lazyLoad : true,
    itemsMobile: 1
    //stagePadding: 100
  });


  function fitFullHeight(){
      $('.full-height').height(window.innerHeight)
  };
  $(window).on('resize', fitFullHeight);
  fitFullHeight();

  function triggerUserScrollEvent(ev){
    if(window.onAutoScrolling !== true){
      $(window).trigger('userscroll');
    }
  }

  window.onAutoScrolling = false;
  window.$bookmarks = $();
  window.$anchors = $('.anchor').each(function(){
    var id = $(this).attr('id');
    var $anchor = $(this);
    var $bookmark = $('<a>').attr('href', '#' + id).text(id).addClass('side-bookmark anchor-' + id).appendTo('.timeline-scroller');
    $bookmark.click(function(){
      window.onAutoScrolling = true;
      $(window).stop(true).scrollTo($anchor.offset().top-100, 1500, function(){
        $(window).trigger('userscroll');
        window.onAutoScrolling = false;
      });
      $('#toggleSideMenu').prop('checked', false);
      return false;
    });
    $anchor.data('$bookmark', $bookmark);
    $bookmark.data('$anchor', $anchor)
    $bookmarks = $bookmarks.add($bookmark);
  });

  var iosDebug = $('<div>').css({
    'background': 'orange',
    'font-size': '45px',
    'position': 'fixed',
    'top': 0,
    'right': 0
  }).appendTo('body');

  var lastScrollTop = 0;
  var scrollDirection = 'down';
  var scrollCount = 0;

  // Stop animation when user scroll
  // $(window).bind("scroll mousedown DOMMouseScroll mousewheel keyup touchstart", function(e){
  //   if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel" || e.type.toString().match(/^touch/) ){
  //     $('html, body').stop();
  //   }
  // });  

  function findCurrentEntry(ev){

    var scrollTop = $(window).scrollTop();
    scrollDirection = (scrollTop >= lastScrollTop) ? 'down' : 'up';
    lastScrollTop = scrollTop;

    var current;
    var viewTop = $(window).scrollTop();
    var viewBottom = viewTop + window.innerHeight;
    var threshold = window.innerHeight*0.33;
    $('.entry').each(function(){
      var entryHeight = $(this).outerHeight();
      var entryTop = this.offsetTop;
      var entryBottom = entryTop + entryHeight;
      if(scrollDirection == 'down' && entryTop>=viewTop && entryTop<=viewBottom-threshold){
        current = $(this);
        return false;
      }
      if(scrollDirection == 'up' && entryBottom>=viewTop+threshold && entryTop<=viewBottom){
        current = $(this);
        return false;
      }
    });

    if(current && !current.hasClass('current')){
      current.addClass('current').siblings().removeClass('current');
      if(!isMobile()){
        current.siblings().find('video').each(function(){
          this.volume = 0;
          this.pause();
        });
        current.find('video[autoplay]').each(function(){
          this.currentTime = 0;
          this.volume = 0.1;
          this.play();
        });
      }
      //current.find('.owl-carousel').size() && current.find('.owl-carousel').data('owlCarousel').next();
    }

    var scrollerHeight = $('.timeline-scroller').height();
    var bookmarksCollapsedMargin = parseInt($bookmarks.css("margin-top"))*($bookmarks.size()-1)
    var bookmarksHeight = $bookmarks.outerHeight(true) * $bookmarks.size() - bookmarksCollapsedMargin;
    var scrollerInnerHeight = scrollerHeight-bookmarksHeight;

    scrollCount++;

    $anchors.each(function(){

      var $bookmark = $(this).data('$bookmark');

      $(this).css('visibility', 'hidden');

      if($(this).offset().top + $(this).outerHeight() < viewTop){
        $bookmark.toggleClass('view-top', true);
        $bookmark.css('top', 0);
      }else{
        $bookmark.toggleClass('view-top', false);
      }

      if($(this).offset().top > viewBottom){
        $bookmark.toggleClass('view-bottom', true);
        $bookmark.css('top', scrollerInnerHeight);
      }else{
        $bookmark.removeClass('view-bottom', false);
      }

      if($(this).offset().top <= viewBottom){
        var stackHeight = $bookmark.prevAll()
          .map(function(){ return $(this).outerHeight(); })
          .toArray()
          .reduce(function(pv, cv) { return pv + cv; }, 0);

        var offset = $bookmark.data('$anchor').offset().top - viewTop - ((scrollerHeight-scrollerInnerHeight)/2) - stackHeight;

        // $bookmark.hasClass('view-current') && console.log(offset,'/',$bookmark.data('$anchor').offset().top, viewTop, ((scrollerHeight-scrollerInnerHeight)/2) , stackHeight)

        offset = offset < 0 ? 0 : offset;
        offset = offset > scrollerInnerHeight ? scrollerInnerHeight : offset;

        $bookmark.toggleClass('view-in', true);
        $bookmark.css('top', offset);
        $bookmark.data('offset', offset);
      }else{
        $bookmark.toggleClass('view-in', false);
      }

    });
  
    $bookmarks.filter('.view-in:last').toggleClass('view-current', true).siblings().toggleClass('view-current', false);



    // var nowYear;
    // $($('.year-line').get().reverse()).each(function(){
    //   var entryTop = this.offsetTop;
    //   var entryBottom = entryTop + $(this).outerHeight();
    //   if(!nowYear && entryTop < viewBottom ){
    //     nowYear = $(this).data('year');
    //     $('.entry.current').removeClass('current')
    //     $(this).addClass('current');
    //   }
    // });

  }

  $(window).scroll(triggerUserScrollEvent);
  $(window).scroll(findCurrentEntry);
  $(window).resize(findCurrentEntry);
  findCurrentEntry();

})