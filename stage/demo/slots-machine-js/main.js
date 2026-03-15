"use strict";

/*
  Slots Machine
  Powered by CSS3 animation & transition

  by Lackneets (lackneets.tw)
*/

(function($, window){

  $.fn.extend({
    translateY: function(val){
      var px = val.toString().match(/\d$/) ? 'px' : '';
      return this.css('webkitTransform', 'translateY(' + val + px + ')').css('Transform', 'translateY(' + val + px + ')')
    }
  });

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

  function SlotsMachine(element, slotsCount, opts){

      this.opts = opts || {};

      this.machine = $(element).first();
      this.slotsCount = slotsCount || 3;
      this.slotsIndex = [0];
      this.cachedImages = [];
      this.slotsElems = [this.machine.find('.slot:first')];

      
      this.state = 'stop';

      this.rowHeight = this.opts.rowHeight;

      this.machine.css('opacity', 0);

      if(this.opts.init){
        this.slotsElems.forEach(function(slot, i){
          this.slotsElems[i].find('.spinner-wrapper').translateY(this.slotsIndex[i] * this.elemHeight + this.elemMargin);
        }.bind(this));
      }

      // Extend spinner length
      this.machine.find('.slot:first .spinner:first').wrap('<div class="spinner-wrapper" />');
      this.machine.find('.slot:first .spinner:first').clone().addClass('append').appendTo(this.machine.find('.spinner-wrapper'));
      this.machine.find('.slot:first .spinner:first').clone().addClass('append').appendTo(this.machine.find('.spinner-wrapper'));
      this.machine.find('.slot:first .spinner:first').clone().addClass('append').appendTo(this.machine.find('.spinner-wrapper'));


      for(var i=1; i<this.slotsCount; i++){
        this.slotsElems[i] = this.slotsElems[0].clone().appendTo(this.machine);
      }

      for(var i=0; i<this.slotsCount; i++){
        this.slotsIndex[i] = this.opts.init ? (this.opts.init[i] || 0) : 0;
      }

      this.machine.find('img').load(function(e){
        var motion = this.createMotionImage(e.target);
        if(motion){
          motion.insertAfter(e.target);
          $(e.target).parent().addClass('has-motion')
        }
      }.bind(this));

      $(window).on('resize', this.resize.bind(this));

      this.resize();
  }

  SlotsMachine.prototype.createMotionImage = function(image){

    try{
      if(this.cachedImages[image.src]){
        return this.cachedImages[image.src].clone();
      }else{
        var canvas = document.createElement('canvas'), ctx;
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight + 40;
        ctx = canvas.getContext('2d');
        ctx.globalAlpha = 0.025;
        for (var y=0;y<40;++y){
          ctx.drawImage(image, 0, 40/-2 + y);
        }
        $(image).addClass('source');
        this.cachedImages[image.src] = $('<img/>').addClass('motion').attr('src', canvas.toDataURL());
        return this.cachedImages[image.src].clone();
      }      
    }catch(e){
      window.motionBlurFailures = window.motionBlurFailures || [];
      if(!window.motionBlurFailures[image.src]){
        window.motionBlurFailures[image.src] = window.motionBlurFailures;
        console.info('Motion blur not applied to', image.src, 'Because of', e);
      }
      return null;
    }
  }

  SlotsMachine.prototype.resize = function(){
    this.recalc();
    if(this.state == 'start'){
      return false;
    }
    this.machine.find('.spinner-wrapper').css('transition', 'none');
    this.slotsElems.forEach(function(slot, i){
      this.slotsElems[i].find('.spinner-wrapper').translateY(this.elemMargin + this.elemHeight*(0*this.elemTotal - this.slotsIndex[i]));
    }.bind(this));

    setTimeout(function() {
      this.machine.find('.spinner > *').css('height', this.elemHeight);
      this.machine.find('.spinner-wrapper').css('transition', '');
      this.machine.css('opacity', 1);
    }.bind(this), 100);
  }

  SlotsMachine.prototype.recalc = function(){
    this.elemHeight = this.machine.find('.slot').height();

    if(this.rowHeight > 0 && this.rowHeight <= 1){
      this.elemHeight = this.elemHeight * this.rowHeight;
    }else if(this.rowHeight > 1){
      this.elemHeight = this.rowHeight;
    }

    this.elemMargin = (this.machine.find('.slot').height() - this.elemHeight)/2;
    this.elemTotal = this.machine.find('.slot .spinner:first > *').length;
  }  

  SlotsMachine.prototype.start = function(){
    if(this.state == 'stop'){

      this.state = 'start';

      this.recalc();

      this.machine.toggleClass('stop', false);
      
      requestAnimationFrame(function() {
        this.machine.toggleClass('start', true);
        this.slotsElems.forEach(function(slot, i){
          this.slotsElems[i].find('.spinner-wrapper').translateY(-1 * Math.random() * this.elemHeight * this.elemTotal * 1);
        }.bind(this));

        this.timeStart = new Date();
      }.bind(this));

    }
  }

  SlotsMachine.prototype.stop = function(resultArray){
    if(this.state == 'start'){

      this.slotsIndex = resultArray || [];

      // Set Transform
      this.machine.find('.spinner').each(function(i, el){
        var transform = window.getComputedStyle(this).webkitTransform;
        $(this).css('webkitTransform', transform).css('Transform', transform)
      });

      //Remove Animation
      this.machine.toggleClass('start', false);

      requestAnimationFrame(function() {
        // Add Transition
        this.machine.toggleClass('stop', true);
        // Reset Transform
        this.machine.find('.spinner').css('webkitTransform', '').css('Transform', '');

        this.slotsElems.forEach(function(slot, i){
          this.slotsIndex[i] = (this.slotsIndex[i] !== undefined) ? (this.slotsIndex[i] % this.elemTotal) : Math.floor(Math.random()*this.elemTotal);
          slot.find('.spinner-wrapper').translateY(this.elemMargin + this.elemHeight*(this.elemTotal - this.slotsIndex[i]));
        }.bind(this));

      }.bind(this));

      this.state = 'stop';

      return this.slotsIndex;
    }
  }

  window.SlotsMachine = SlotsMachine;

})(jQuery, window);


