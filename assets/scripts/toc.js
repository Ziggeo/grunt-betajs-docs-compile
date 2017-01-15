(function($) {
	$.fn.maketoc = function(toc, options) {
		var element = this;
		options = options || {};
		var entryTemplate = options.entryTemplate || function (entry, level) {
			return '<a class="list-group-item" data-toc-level="' + level + '" href="' + entry.link
					+ '" ' + (entry.collapsed ? 'style="display:none"' : '') + '><span class="toc-h' + level + '">'
					+ entry.title + '</span></a>';
		};
		var createLevel = function(toc, level) {
			toc.forEach(function(entry) {
				var entryElement = $(entryTemplate(entry, level));
				element.append(entryElement);
				createLevel(entry.children, level + 1);
			});
		};
		createLevel(toc, 1);
	};
	$.fn.toccontrol = function (action) {
		var actions = {
			expand: function (link, children) {
				var base = $(this).find("[href='" + link + "']");
				var base_level = parseInt(base.data("toc-level"));
				var current = base;
				while (current.data("toc-level") && parseInt(current.data("toc-level")) >= 1) {
					current.show();
					current = current.prev();
				}
				if (children) {
					current = base.next();
					while (current.data('toc-level') && parseInt(current.data("toc-level")) === base_level + 1) {
						current.show();
						current = current.next();
					}
				}
			},
			collapse: function (link, children) {
				var current = $(this).find("[href='" + link + "']");
				var base = $(this).find("[href='" + link + "']");
				var base_level = parseInt(base.data("toc-level"));
				var current = base;
				current = base.next();
				while (current.data('toc-level') && parseInt(current.data("toc-level")) > base_level) {
					current.hide();
					current = current.next();
				}
				if (!children)
					base.hide();
			}
		};
		actions[action].apply(this, Array.prototype.slice.call(arguments, 1));
	};
})(jQuery);


/*
 * Selection
 * Auto-Collapse
 * Multi Tutorial
 * TOC Filter?
 * 
 * 
 */
/************************/


(function($) {
  var navbarHeight;
  var initialised = false;
  var navbarOffset;

  function elOffset($el) {
    return $el.offset().top - (navbarHeight + navbarOffset);
  }

  function scrollToHash(duringPageLoad) {
    var elScrollToId = location.hash.replace(/^#/, '');
    var $el;

    function doScroll() {
      var offsetTop = elOffset($el);
      window.scrollTo(window.pageXOffset || window.scrollX, offsetTop);
    }

    if (elScrollToId) {
      $el = $(document.getElementById(elScrollToId));

      if (!$el.length) {
        $el = $(document.getElementsByName(elScrollToId));
      }

      if ($el.length) {
        if (duringPageLoad) {
          $(window).one('scroll', function() {
            setTimeout(doScroll, 100);
          });
        } else {
          setTimeout(doScroll, 0);
        }
      }
    }
  }

  function init(opts) {
    if (initialised) {
      return;
    }
    initialised = true;
    navbarHeight = $('.navbar').height();
    navbarOffset = opts.navbarOffset;

    // some browsers move the offset after changing location.
    // also catch external links coming in
    $(window).on("hashchange", scrollToHash.bind(null, false));
    $(scrollToHash.bind(null, true));
  }

  $.catchAnchorLinks = function(options) {
    var opts = $.extend({}, jQuery.fn.toc.defaults, options);
    init(opts);
  };

  $.fn.toc = function(options) {
    var self = this;
    var opts = $.extend({}, jQuery.fn.toc.defaults, options);

    var container = $(opts.container);
    var tocs = [];
    var headings = $(opts.selectors, container);
    var headingOffsets = [];
    var activeClassName = 'active';
    var ANCHOR_PREFIX = "__anchor";
    var maxScrollTo;
    var visibleHeight;
    var headerHeight = 10; // so if the header is readable, its counted as shown
    init();

    var scrollTo = function(e) {
      e.preventDefault();
      var target = $(e.target);
      if (target.prop('tagName').toLowerCase() !== "a") {
        target = target.parent();
      }
      var elScrollToId = target.attr('href').replace(/^#/, '') + ANCHOR_PREFIX;
      var $el = $(document.getElementById(elScrollToId));

      var offsetTop = Math.min(maxScrollTo, elOffset($el));

      $('body,html').animate({ scrollTop: offsetTop }, 400, 'swing', function() {
        location.hash = '#' + elScrollToId;
      });

      $('a', self).removeClass(activeClassName);
      target.addClass(activeClassName);
    };

    var calcHadingOffsets = function() {
      maxScrollTo = $("body").height() - $(window).height();
      visibleHeight = $(window).height() - navbarHeight;
      headingOffsets = [];
      headings.each(function(i, heading) {
        var anchorSpan = $(heading).prev("span");
        var top = 0;
        if (anchorSpan.length) {
          top = elOffset(anchorSpan);
        }
        headingOffsets.push(top > 0 ? top : 0);
      });
    }

    //highlight on scroll
    var timeout;
    var highlightOnScroll = function(e) {
      if (!tocs.length) {
        return;
      }
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function() {
        var top = $(window).scrollTop(),
          highlighted;
        for (var i = headingOffsets.length - 1; i >= 0; i--) {
          var isActive = tocs[i].hasClass(activeClassName);
          // at the end of the page, allow any shown header
          if (isActive && headingOffsets[i] >= maxScrollTo && top >= maxScrollTo) {
            return;
          }
          // if we have got to the first heading or the heading is the first one visible
          if (i === 0 || (headingOffsets[i] + headerHeight >= top && (headingOffsets[i - 1] + headerHeight <= top))) {
            // in the case that a heading takes up more than the visible height e.g. we are showing
            // only the one above, highlight the one above
            if (i > 0 && headingOffsets[i] - visibleHeight >= top) {
              i--;
            }
            $('a', self).removeClass(activeClassName);
            if (i >= 0) {
              highlighted = tocs[i].addClass(activeClassName);
              opts.onHighlight(highlighted);
            }
            break;
          }
        }
      }, 50);
    };
    if (opts.highlightOnScroll) {
      $(window).bind('scroll', highlightOnScroll);
      $(window).bind('load resize', function() {
        calcHadingOffsets();
        highlightOnScroll();
      });
    }

    return this.each(function() {
      //build TOC
      var el = $(this);
      var ul = $('<div class="list-group">');

      headings.each(function(i, heading) {
        var $h = $(heading);

        var anchor = $('<span/>').attr('id', opts.anchorName(i, heading, opts.prefix) + ANCHOR_PREFIX).insertBefore($h);

        var span = $('<span/>')
          .text(opts.headerText(i, heading, $h));

        //build TOC item
        var a = $('<a class="list-group-item"/>')
          .append(span)
          .attr('href', '#' + opts.anchorName(i, heading, opts.prefix))
          .bind('click', function(e) {
            scrollTo(e);
            el.trigger('selected', $(this).attr('href'));
          });

        span.addClass(opts.itemClass(i, heading, $h, opts.prefix));

        tocs.push(a);

        ul.append(a);
      });
      el.html(ul);

      calcHadingOffsets();
    });
};


jQuery.fn.toc.defaults = {
  container: 'body',
  selectors: 'h1,h2,h3',
  smoothScrolling: true,
  prefix: 'toc',
  onHighlight: function() {},
  highlightOnScroll: true,
  navbarOffset: 0,
  anchorName: function(i, heading, prefix) {
    return prefix+i;
  },
  headerText: function(i, heading, $heading) {
    return $heading.text();
  },
  itemClass: function(i, heading, $heading, prefix) {
    return prefix + '-' + $heading[0].tagName.toLowerCase();
  }

};

})(jQuery);
