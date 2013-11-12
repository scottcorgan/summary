(function summary () {
  var Summary = {
    _scrollFromTopPaddingFix: 100,
    _scrollHeightPaddingFix: $(document).height() + 50,
    
    triggers: [],
    $firstSection: null,
    $lastSection: null,
    
    $window: $(window),
    $sectionsWrapper: $('.sections-wrapper'),
    $sections: $('.section'),
    $nav: $('.content-wrapper > nav'),
    $navWrapper: $('.content-wrapper > nav > ul'),
    navWrapperOuterHeight: 0,
    
    init: function () {
      Summary.$sections.each(Summary.sectionSetup);
      Summary.$sectionsWrapper.on('scroll', Summary.sectionsScroll);
      Summary.$sectionsWrapper.trigger('scroll');
    },
    
    activateNavItem: function ($el) {
      $('#navbar .nav li.active').removeClass('active');
      $el.addClass('active');
    },
    
    sectionSetup: function (idx, el) {
      var $el = $(el);
      var elId = $el.attr('id');
      var href = '#' + elId;
      var $navItem = $('<li class="summary-' + elId + '""><a href="' + href + '">' + $el.attr('title') + '</a></li>');
      var $clickable = $navItem.find('a');
      
      Summary.triggers.push(elId);
      
      $clickable.on('click', function (e) {
        e.preventDefault();
        Summary.$sectionsWrapper.scrollTo(href);
      });
      
      if (idx === 0) Summary.$firstSection = $navItem;
      if (Summary.$sections.length - 1 === idx) Summary.$lastSection = $navItem;
      
      Summary.$navWrapper.append($navItem);
      Summary.navWrapperOuterHeight = Summary.$navWrapper.outerHeight();
    },
    
    sectionsScroll: function() {
      var $content = Summary.$sectionsWrapper;
      
      if ($content.scrollTop() < Summary._scrollFromTopPaddingFix) {
        Summary.activateNavItem(Summary.$firstSection);
      }
      else if ($content.scrollTop() >= ($content[0].scrollHeight - Summary._scrollHeightPaddingFix)) {
        Summary.activateNavItem(Summary.$lastSection);
      }
      else{
        $.each(Summary.triggers, function (idx, elId) {
          var elOffsetTop = $('#' + elId).offset().top;
          
          if (elOffsetTop > 0 && elOffsetTop < 200) {
            Summary.activateNavItem($('li.summary-' + elId));
            return false;
          }
        });
      }
    }
  };
  
  Summary.init();
}());