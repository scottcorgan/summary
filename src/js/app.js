(function () {
  
  function positionNav () {
    var $nav = $('.main > nav');
    var $navWrapper = $nav.find('> ul');
    var navHeight = $navWrapper.outerHeight();
    
    $navWrapper.css({
      position:'absolute',
      top: $nav.outerHeight()/2 - navHeight/2
    });
  }
  
  $(window).resize(function () { positionNav(); });
  positionNav();
  
  var triggers = [];
  
  $.fn.scrollTo = function( target, options, callback ){
    if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
    var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 0,
    duration      : 200,
    easing        : 'swing'
    }, options);
    return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - settings.offsetTop;
    scrollPane.animate({scrollTop : scrollY }, settings.duration, settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
    });
  }
  
  $('#navbar .nav li a').each(function (idx, el) {
    triggers.push($(el).attr('href'));
    
    var $el = $(el);
    
    $el.click(function (e) {
      e.preventDefault();
      var id = $el.attr('href');
      $('section.content').scrollTo(id);
    });
  });
  
  $('section.content').scroll(function () {
    if ($('section.content').scrollTop() < 100) {
      $('#navbar .nav li.active').removeClass('active');
      $('#navbar a[href=#download]').parent().addClass('active');
    }
    else{
      $.each(triggers, function (idx, elId) {
        var top = $(elId).offset().top;
        
        if (top > 0 && top < 200) {
          $('#navbar .nav li.active').removeClass('active');
          $('#navbar a[href=' + elId + ']').parent().addClass('active');
        }
      });
    }
  });
}());