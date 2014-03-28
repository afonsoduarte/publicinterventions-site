( function( window ) {

'use strict';

function Controller() {
  var activeArticle = '';

  console.log(this);

  this.init();
}

Controller.prototype.init = function() {
  var slug;
  if(!window.location.hash) {
    this.activeArticle = $('article:first-child');
  }else{
    slug = window.location.hash.replace('#', '');
    this.goToArticle(slug);
  }
};

Controller.prototype.goToNextArticle = function() {
  var next = this.activeArticle.next();
  if(next.length === 0) return false;
  $('html, body').scrollTop( next.offset().top +1 );
};

Controller.prototype.goToPreviousArticle = function() {
  var prev = this.activeArticle.prev();
  if( prev.length === 0 ) return false;
  $('html, body').scrollTop( prev.offset().top );
};

Controller.prototype.goToArticle = function(slug) {
  $('html, body').scrollTop( $('#id-'+slug).offset().top + 1 );
};

Controller.prototype.updateURL = function(slug) {
  slug = slug.replace('id-', '');
  location.hash = '#'+slug;
  this.activeArticle = $('#id-'+slug);
};

window.Controller = Controller;

})( window );


// var myParam = getQueryString()["myParam"];
function getQueryString() {
  var result = {},
      queryString = location.search.substring(1),
      re = /([^&=]+)=([^&]*)/g,
      m;
  while(m === re.exec(queryString)){
    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return result;
}


(function($) {
  // jQuery plugin definition
  $.fn.gallery = function(params) {
    // merge default and user parameters
    params = $.extend( {imageContainer: '.image'}, params);

    // find image containers
    var $imageContainers = this.find(params.imageContainer);

    // Check if there's more than one image
    if($imageContainers.length <= 1) return false;

    // Store gallery data
    this.data({currentImage: 1, totalImages: $imageContainers.length});

    // hide image containers and show first one
    $imageContainers.first().addClass('show');

    // Add previous and next buttons and image counter
    $prevButton = $('<a role="button">').addClass('prev-btn').on( 'click', prevImage );
    $nextButton = $('<a role="button">').addClass('next-btn').on( 'click', nextImage );
    $imageCounter = $('<div>').addClass('image-counter').html('<span class="current-image">1</span>/'+$imageContainers.length);

    this
      .addClass('gallery')
      .prepend($prevButton, $nextButton)
      .on('nextSlide', nextImage)
      .on('previousSlide', prevImage)
      .find('.content')
        .append($imageCounter);

    // allow jQuery chaining
    return this;
  };

  var prevImage = function(event) {
    $target = $(event.target);
    $gallery = ( $target.parent('article').length > 0 )? $target.parent('article') : $target;
    var $currentImage = $gallery.find('.show');
    $currentImage.removeClass('show');
    if($currentImage.prev().length > 0){
      $currentImage.prev().addClass('show');
      $gallery.data().currentImage--;
      $gallery.find('.image-counter span').text($gallery.data().currentImage);
    }
    else {
      $currentImage.siblings().last().addClass('show');
      $gallery.data().currentImage = $gallery.data().totalImages;
      $gallery.find('.image-counter span').text($gallery.data().totalImages);
    }
  };

  var nextImage = function(event) {
    $target = $(event.target);
    $gallery = ( $target.parent('article').length > 0 )? $target.parent('article') : $target;
    var $currentImage = $gallery.find('.show');
    $currentImage.removeClass('show');
    if($currentImage.next().length > 0){
      $currentImage.next().addClass('show');
      $gallery.data().currentImage++;
      $gallery.find('.image-counter span').text($gallery.data().currentImage);
    }
    else {
      $currentImage.siblings().first().addClass('show');
      $gallery.data().currentImage = 1;
      $gallery.find('.image-counter span').text($gallery.data().currentImage);
    }
  };

})(jQuery);

/*
jQuery Waypoints - v1.1.7
Copyright (c) 2011-2012 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/MIT-license.txt
https://github.com/imakewebthings/jquery-waypoints/blob/master/GPL-license.txt
*/
(function($,k,m,i,d){var e=$(i),g="waypoint.reached",b=function(o,n){o.element.trigger(g,n);if(o.options.triggerOnce){o.element[k]("destroy")}},h=function(p,o){if(!o){return -1}var n=o.waypoints.length-1;while(n>=0&&o.waypoints[n].element[0]!==p[0]){n-=1}return n},f=[],l=function(n){$.extend(this,{element:$(n),oldScroll:0,waypoints:[],didScroll:false,didResize:false,doScroll:$.proxy(function(){var q=this.element.scrollTop(),p=q>this.oldScroll,s=this,r=$.grep(this.waypoints,function(u,t){return p?(u.offset>s.oldScroll&&u.offset<=q):(u.offset<=s.oldScroll&&u.offset>q)}),o=r.length;if(!this.oldScroll||!q){$[m]("refresh")}this.oldScroll=q;if(!o){return}if(!p){r.reverse()}$.each(r,function(u,t){if(t.options.continuous||u===o-1){b(t,[p?"down":"up"])}})},this)});$(n).bind("scroll.waypoints",$.proxy(function(){if(!this.didScroll){this.didScroll=true;i.setTimeout($.proxy(function(){this.doScroll();this.didScroll=false},this),$[m].settings.scrollThrottle)}},this)).bind("resize.waypoints",$.proxy(function(){if(!this.didResize){this.didResize=true;i.setTimeout($.proxy(function(){$[m]("refresh");this.didResize=false},this),$[m].settings.resizeThrottle)}},this));e.load($.proxy(function(){this.doScroll()},this))},j=function(n){var o=null;$.each(f,function(p,q){if(q.element[0]===n){o=q;return false}});return o},c={init:function(o,n){this.each(function(){var u=$.fn[k].defaults.context,q,t=$(this);if(n&&n.context){u=n.context}if(!$.isWindow(u)){u=t.closest(u)[0]}q=j(u);if(!q){q=new l(u);f.push(q)}var p=h(t,q),s=p<0?$.fn[k].defaults:q.waypoints[p].options,r=$.extend({},s,n);r.offset=r.offset==="bottom-in-view"?function(){var v=$.isWindow(u)?$[m]("viewportHeight"):$(u).height();return v-$(this).outerHeight()}:r.offset;if(p<0){q.waypoints.push({element:t,offset:null,options:r})}else{q.waypoints[p].options=r}if(o){t.bind(g,o)}if(n&&n.handler){t.bind(g,n.handler)}});$[m]("refresh");return this},remove:function(){return this.each(function(o,p){var n=$(p);$.each(f,function(r,s){var q=h(n,s);if(q>=0){s.waypoints.splice(q,1);if(!s.waypoints.length){s.element.unbind("scroll.waypoints resize.waypoints");f.splice(r,1)}}})})},destroy:function(){return this.unbind(g)[k]("remove")}},a={refresh:function(){$.each(f,function(r,s){var q=$.isWindow(s.element[0]),n=q?0:s.element.offset().top,p=q?$[m]("viewportHeight"):s.element.height(),o=q?0:s.element.scrollTop();$.each(s.waypoints,function(u,x){if(!x){return}var t=x.options.offset,w=x.offset;if(typeof x.options.offset==="function"){t=x.options.offset.apply(x.element)}else{if(typeof x.options.offset==="string"){var v=parseFloat(x.options.offset);t=x.options.offset.indexOf("%")?Math.ceil(p*(v/100)):v}}x.offset=x.element.offset().top-n+o-t;if(x.options.onlyOnScroll){return}if(w!==null&&s.oldScroll>w&&s.oldScroll<=x.offset){b(x,["up"])}else{if(w!==null&&s.oldScroll<w&&s.oldScroll>=x.offset){b(x,["down"])}else{if(!w&&s.element.scrollTop()>x.offset){b(x,["down"])}}}});s.waypoints.sort(function(u,t){return u.offset-t.offset})})},viewportHeight:function(){return(i.innerHeight?i.innerHeight:e.height())},aggregate:function(){var n=$();$.each(f,function(o,p){$.each(p.waypoints,function(q,r){n=n.add(r.element)})});return n}};$.fn[k]=function(n){if(c[n]){return c[n].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof n==="function"||!n){return c.init.apply(this,arguments)}else{if(typeof n==="object"){return c.init.apply(this,[null,n])}else{$.error("Method "+n+" does not exist on jQuery "+k)}}}};$.fn[k].defaults={continuous:true,offset:0,triggerOnce:false,context:i};$[m]=function(n){if(a[n]){return a[n].apply(this)}else{return a.aggregate()}};$[m].settings={resizeThrottle:200,scrollThrottle:100};e.load(function(){$[m]("refresh")})})(jQuery,"waypoint","waypoints",window);