"use strict";

/*
 ECMA5 Class inheritance inspired by Babel
*/
function classDefine(subClass, prototype, staticMembers){
  return classInherit(Object, subClass, prototype, staticMembers);
}
function classInherit(superClass, subClass, prototype, staticMembers){
  subClass.prototype = Object.create(superClass.prototype, {
    super: {value: superClass, enumerable: false, writable: false, configurable: true },
    constructor: {value: subClass, enumerable: false, writable: false, configurable: true },
  }); // Extend the prototype from super class
  subClass.__proto__ = superClass; // Link the actual proto chaining
  Object.assign(subClass.prototype, prototype || {}); // Shortcut to define sub class instance methods
  Object.assign(subClass, staticMembers || {}); // Shortcut to define sub class instance methods
  return subClass;
}

/* Main */

$(function(){
  var demo = new GalleryDemo();
});

$(document).on('mouseenter', 'a[href]:not([target])', function(){
  if(this.getAttribute('href').match(/^(https?:)?\/\//)){
    this.setAttribute('target', '_blank');
  }
});

$.get('version.txt', function(v){
  $('#version').text(v);
})

/* Lib */

var Emoticon = classDefine(function Emoticon(props){
    this.url = props.url;
    this.keyword = props.keyword || this.randomName();
    this.alias = props.alias || '';
    this.search = props.search || '';
    this.score = props.score || 0;
},{
  randomName: function (){
    var index = Emoticon.storage.indexOf(this.url);
    if(index == -1){
      Emoticon.storage.push(this.url);
      return "emo_hot_" + (Emoticon.storage.length);
    }else{
      return "emo_hot_" + (index+1);
    }
  },
  clone: function(args){
    return Object.assign(new this.constructor(this), args || {});
  }
},{
  storage: []
});

var EmoticonCustom = classInherit(Emoticon, function EmoticonCustom(){
  this.super.apply(this, arguments);
});


function GalleryDemo(){

  this.$gallery         = $('.main-header .gallery').empty();
  this.$input           = $('.main-header input.post-input');
  this.$filter          = $('.main-header input.filter');
  this.$candidate       = $('.main-header .candidate').hide();
  this.$tabsSwitch      = $('.main-header .tabs a');

  this.emoticonsHot = [];
  this.emoticonsDefault = [].concat(
    EmoticonsList.basic,
    EmoticonsList.platinum,
    EmoticonsList.platinum_2,
    EmoticonsList.silver,
    EmoticonsList.gold,
    EmoticonsList.karma100,
    EmoticonsList.extras
    );

  this.emoticonsBasic = EmoticonsList.basic.map(function(e){
    return new Emoticon(e);
  });  

  this.emoticonsDefault = this.emoticonsDefault.map(function(e){
    return new Emoticon(e);
  });

  this.loadHotEmoticonsAsync();

  this.renderEmoticons(this.emoticonsBasic, this.$gallery);

  this.$input.on('keyup mousedown', this.renderCandidate.bind(this));

  this.$tabsSwitch.on('click', function(event){
    if($(event.target).hasClass('tab-gallery')){
      this.renderEmoticons(this.emoticonsHot, this.$gallery);
    }else if($(event.target).hasClass('tab-default')){
      this.renderEmoticons(this.emoticonsBasic, this.$gallery);
    }
    this.$tabsSwitch.toggleClass('active', false);
    $(event.target).toggleClass('active', true);
  }.bind(this));

}

GalleryDemo.prototype.loadHotEmoticonsAsync = function(){
  $.ajax({
    url: 'hot.json',
    dataType: 'json'
  }).success(function(emoticonsData){
    this.emoticonsHot = emoticonsData.map(function(data){
      return new EmoticonCustom(data);
    });
  }.bind(this));
}

GalleryDemo.prototype.renderEmoticons = function(emos, container){
  $(container).empty();
  emos.forEach(function(emo){
    emo && this.pushEmoticon(emo, $(container));
  }, this);
}

GalleryDemo.prototype.pushEmoticon = function(emo, container) {
  var el = $('<div/>', {
    class: 'emoticon loading',
    title: emo.keyword + (emo.score ? "\nScore: " + emo.score : ''),
    html: $('<img/>', {
      src: emo.url,
    }).on('load', function(){
      el.removeClass('loading');
    })
  }).on('click', this.insertEmoticon.bind(this, emo));

  $(container).append(el);
};

GalleryDemo.prototype.insertEmoticon = function(emo, reverse){
  var pos = this.$input[0].selectionStart;
  var text = this.$input[0].value;
  var reverse = emo.search.length;
  var posStart = pos - reverse;
  var posEnd = posStart + emo.keyword.length + 1;

  var openTag   = (emo instanceof EmoticonCustom) ? '[' : '';
  var closeTag  = (emo instanceof EmoticonCustom) ? ']' : '';

  posEnd += (emo instanceof EmoticonCustom) ? 2 : 0;

  emo.search && this.$candidate.hide();

  this.$input.val(  text.substring(0, posStart) + openTag + emo.keyword + closeTag + ' ' + text.substring(pos) );
  this.$input[0].setSelectionRange(reverse ? posStart : posEnd, posEnd);
}

GalleryDemo.prototype.renderCandidate = function(event){
  var key = event.keyCode;
  var keyNum = String(String.fromCharCode((96 <= key && key <= 105)? key-48 : key).match(/\d/)) || null;

  var pos = event.target.selectionStart;
  var value = event.target.value.toLowerCase().substring(0, event.target.selectionStart);
  var keywords = [];
  for( var i = value.length-1; i >= Math.max(0, value.length-8); i--){
    var k = value.substr(i, value.length);
    if(k == keywords[keywords.length]) break;
    if(k.length == 1 && k.match(/^[0-9a-zA-Z\(\)]{1}$/)) continue;
    if(k.length > 1 && k.match(/[ㄦㄢㄞㄚㄧㄗㄓㄐㄍㄉㄅㄣㄟㄛㄨㄘㄔㄑㄎㄊㄆㄤㄠㄜㄩㄙㄕㄒㄏㄋㄇㄥㄡㄝㄖㄌㄈ]$/)) keywords.push(k.substr(0, k.length-1));
    keywords.push(k);
  };

  // Find by keywords patterns
  var candidate = [];
  [].concat(
    this.emoticonsDefault,
    this.emoticonsHot).forEach(function(emo){
    keywords.forEach(function(search){
      if(emo.keyword.indexOf(search) >= 0){
        candidate.push(emo.clone({
          score: 10 - emo.keyword.indexOf(search) + search.length*3,
          search: search,
        }));
      }
      if(emo.alias.indexOf(search) >= 0){
        candidate.push(emo.clone({
          score: 10 - emo.alias.indexOf(search) + search.length*3,
          search: search,
        }));
      }
    })
  });
  
  // Sort by score
  candidate.sort(function(a, b){
    return b.score - a.score;
  });

  // remove duplicated
  var emos = [];
  candidate = candidate.filter(function(e){
    if(emos.indexOf(e.url) >= 0){
      return false;
    }else{
      emos.push(e.url);
      return true;
    }
  });

  if(event.altKey && keyNum !== null && keyNum > 0){
    this.insertEmoticon(candidate[keyNum-1]);
    this.$candidate.hide();
    return false;
  }

  if(event.keyCode == 18){ // release alt key
    return false;
  }

  if(candidate.length == 0){
    this.$candidate.hide();
  }else{
    this.$candidate.empty();

    candidate.length = 16;

    candidate.forEach(function(c_emo){
      this.pushEmoticon(c_emo, this.$candidate);
    }, this);

    this.$candidate.show();
  }
}