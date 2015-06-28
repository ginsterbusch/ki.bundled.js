/**
 * Bundles ki.js, ki.extend, CSSClass + a few polyfills
 */


/*!
 * ki.js - jQuery-like API super-tiny JavaScript library
 * Copyright (c) 2014 Denis Ciccale (@tdecs)
 * Released under MIT license
 */
!function (b, c, d, e, f) {

  // addEventListener support?
  f = b['add' + e]

  /*
   * init function (internal use)
   * a = selector, dom element or function
   * d = placeholder for matched elements
   * i = placeholder for length of matched elements
   */
  function i(a, d, i) {
    for(d = (a && a.nodeType ? [a] : '' + a === a ? b.querySelectorAll(a) : c), i = d.length; i--; c.unshift.call(this, d[i]));
  }

  /*
   * $ main function
   * a = css selector, dom object, or function
   * http://www.dustindiaz.com/smallest-domready-ever
   * returns instance or executes function on ready
   */
  $ = function (a) {
    return /^f/.test(typeof a) ? /in/.test(b.readyState) ? setTimeout('$('+a+')', 9) : a() : new i(a)
  }

  // set ki prototype
  $[d] = i[d] = {

    // default length
    length: 0,

    /*
     * on method
     * a = string event type i.e 'click'
     * b = function
     * return this
     */
    on: function (a, b) {
      return this.each(function (c) {
        f ? c['add' + e](a, b, false) : c.attachEvent('on' + a, b)
      })
    },

    /*
     * off method
     * a = string event type i.e 'click'
     * b = function
     * return this
     */
    off: function (a, b) {
      return this.each(function (c) {
        f ? c['remove' + e](a, b) : c.detachEvent('on' + a, b)
      })
    },

    /*
     * each method
     * a = the function to call on each iteration
     * b = the this value for that function (the current iterated native dom element by default)
     * return this
     */
    each: function (a, b) {
      for (var c = this, d = 0, e = c.length; d < e; ++d) {
        a.call(b || c[d], c[d], d, c)
      }
      return c
    },

    // for some reason is needed to get an array-like
    // representation instead of an object
    splice: c.splice
  }
}(document, [], 'prototype', 'EventListener');

/**
 * @link http://jsperf.com/map-reduce-named-functions/2
 * map3: "My own simple implementation"
 * 
 * Also see @link http://stackoverflow.com/questions/22182454/javascript-performance-of-array-map
 */

if( !Array.map ) {
	Array.map = function(callback, thisArg ) {
	  'use strict';
	  if (typeof callback !== 'function') {
		throw new TypeError();
	  }

	  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;

	  for (var i = 0, len = this.length; i < len; i++) {
		this[i] = callback.call(thisArg, this[i], i, this);
	  };
	};
}

/**
 * Polyfill Array.filter
 * @link https://gist.github.com/eliperelman/1031656
 */

[].filter||(Array.prototype.filter=function(a,b,c,d,e){c=this;d=[];for(e in c)~~e+''==e&&e>=0&&a.call(b,c[e],+e,c)&&d.push(c[e]);return d})

/**
 * @link https://github.com/EarMaster/CSSClass
 */

(function () {
	// add indexOf to Array prototype for IE<8
	// this isn't failsafe, but it works on our behalf
	Array.prototype.CSSClassIndexOf = Array.prototype.indexOf || function (item) {
		var length = this.length;
		for (var i = 0; i<length; i++)
			if (this[i]===item) return i;
		return -1;
	};
	// check if classList interface is available (@see https://developer.mozilla.org/en-US/docs/Web/API/element.classList)
	var cl = ("classList" in document.createElement("a"));
	// actual Element prototype manipulation
	var p = Element.prototype;
	if(cl) {
		if(!p.hasClass)
			p.hasClass = function(c) {
				var e = Array.prototype.slice.call(this.classList);
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(!this.classList.contains(c[i]))
						return false;
				return true;
			};
		if(!p.addClass)
			p.addClass = function(c) {
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(!this.hasClass(c[i]))
						this.classList.add(c[i]);
				return this;
			};
		if(!p.removeClass)
			p.removeClass = function(c) {
				var e = this.className.split(' ');
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(this.hasClass(c[i]))
						this.classList.remove(c[i]);
				return this;
			};
		if(!p.toggleClass)
			p.toggleClass = function(c) {
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					this.classList.toggle(c[i]);
				return this;
			};
	} else {
		if(!p.hasClass)
			p.hasClass = function(c) {
				var e = this.className.split(' ');
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(e.CSSClassIndexOf(c[i])===-1)
						return false;
				return true;
			};
		if(!p.addClass)
			p.addClass = function(c) {
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(!this.hasClass(c[i]))
						this.className = this.className!==''?(this.className+' '+c[i]):c[i];
				return this;
			};
		if(!p.removeClass)
			p.removeClass = function(c) {
				var e = this.className.split(' ');
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if(this.hasClass(c[i]))
						e.splice(e.CSSClassIndexOf(c[i]), 1);
				this.className = e.join(' ');
				return this;
			};
		if(!p.toggleClass)
			p.toggleClass = function(c) {
				c = c.split(' ');
				for(var i=0; i<c.length; i++)
					if (this.hasClass(c[i]))
						this.removeClass(c[i]);
					else
						this.addClass(c[i]);
				return this;
			};
	}
	var pl = NodeList.prototype;
	if (!pl.hasClass)
		pl.hasClass = function (c, all) {
			if (all===undefined) all = true;
			for (var i=this.length-1; i>=0; --i) {
				var hc = this[i].hasClass(c);
				if (all && !hc) return false;
				if (!all && hc) return true;
			}
			return true;
		};
	if (!pl.addClass)
		pl.addClass = function (c) {
			for (var i=0; i<this.length; ++i)
				this[i].addClass(c);
		};
	if (!pl.removeClass)
		pl.removeClass = function (c) {
			for (var i=0; i<this.length; ++i)
				this[i].removeClass(c);
		};
	if (!pl.toggleClass)
		pl.toggleClass = function (c) {
			for (var i=0; i<this.length; ++i)
				this[i].toggleClass(c);
		};
})();

/*!
 * ki.extend.js
 * extend ki.js with jQuery style prototypes
 * @author James Doyle (james2doyle)
 * @license MIT
 * Resource for prototypes
 * http://youmightnotneedjquery.com/
 */

(function() {

$.each = function(arr, callback) {
  var i = 0, l = arr.length;
  for(; i < l; ++i) {
    callback.call(arr[i], i, arr[i]);
  }
  return this;
};

// map some classlist functions to the jQuery counterpart
var props = ['addClass', 'removeClass', 'toggleClass'],
maps = ['add', 'remove', 'toggle'];

props.forEach(function(prop, index) {
  $.prototype[prop] = function(a) {
    return this.each(function(b) {
      b.classList[maps[index]](a);
    });
  };
});

$.prototype.hasClass = function(a) {
  return this[0].classList.contains(a);
};


$.prototype.append = function(a) {
  return this.each(function(b) {
    b.appendChild(a[0]);
  });
};

$.prototype.prepend = function(a) {
  return this.each(function(b) {
    b.insertBefore(a[0], b.parentNode.firstChild);
  });
};

$.prototype.hide = function() {
  return this.each(function(b) {
    b.style.display = 'none';
  });
};

$.prototype.show = function() {
  return this.each(function(b) {
    b.style.display = '';
  });
};

$.prototype.attr = function(a, b) {
  return b === []._ ? this[0].getAttribute(a) : this.each(function(c) {
    c.setAttribute(a, b);
  });
};

$.prototype.removeAttr = function(a) {
  return this.each(function(b) {
    b.removeAttribute(a);
  });
};

$.prototype.hasAttr = function(a) {
  return this[0].hasAttribute(a);
};

$.prototype.before = function(a) {
  return this.each(function(b) {
    b.insertAdjacentHTML('beforebegin', a);
  });
};

$.prototype.after = function(a) {
  return this.each(function(b) {
    b.insertAdjacentHTML('afterend', a);
  });
};

$.prototype.css = function(a, b) {
  if (typeof(a) === 'object') {
    for(var prop in a) {
      this.each(function(c) {
        c.style[prop] = a[prop];
      });
    }
    return this;
  } else {
    return b === []._ ? this[0].style[a] : this.each(function(c) {
      c.style[a] = b;
    });
  }
};

$.prototype.first = function() {
  return $(this[0]);
};

$.prototype.last = function() {
  return $(this[this.length - 1]);
};

$.prototype.get = function(a) {
  return $(this[a]);
};

$.prototype.text = function(a) {
  return a === []._ ? this[0].textContent : this.each(function(b) {
    b.textContent = a;
  });
};

$.prototype.html = function(a) {
  return a === []._ ? this[0].innerHTML : this.each(function(b) {
    b.innerHTML = a;
  });
};

$.prototype.parent = function() {
  return (this.length < 2) ? $(this[0].parentNode): [];
};

$.prototype.remove = function() {
  return this.each(function(b) {
    b.parentNode.removeChild(b);
  });
};

$.trim = function(a) {
  return a.replace(/^\s+|\s+$/g, '');
};

$.prototype.trigger = function(a) {
  if (document.createEvent) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(a, true, false);
    this.each(function(b) {
      b.dispatchEvent(event);
    });
  } else {
    this.each(function(b) {
      b.fireEvent('on' + a);
    });
  }
};

$.prototype.is = function(a) {
  var m = (this[0].matches || this[0].matchesSelector || this[0].msMatchesSelector || this[0].mozMatchesSelector || this[0].webkitMatchesSelector || this[0].oMatchesSelector);
  if (m) {
    return m.call(this[0], a);
  } else {
    var n = this[0].parentNode.querySelectorAll(a);
    for (var i = n.length; i--;) {
      if (n[i] === this[0]) {
        return true;
      }
    }
    return false;
  }
};

"filter map".split(" ").forEach(function(m) {
  $[m] = function(a, b) {
    return a[m](b);
  };
});

$.stop = function(e) {
  if (!e.preventDefault) {
    e.returnValue = false;
  } else {
    e.preventDefault();
  }
};

$.param = function(obj, prefix) {
  var str = [];
  for(var p in obj) {
    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
    str.push(typeof v == "object" ? $.param(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
  }
  return str.join("&");
};

// var p = new $.Deferred();
// p.resolve(n);
// return p.promise();

$.ajax = function(a, b, c) {
  var xhr = new XMLHttpRequest();
  var p = new $.Deferred();
  // 1 == post, 0 == get
  var type = (typeof(b) === 'object') ? 1: 0;
  var gp = ['GET', 'POST'];
  xhr.open(gp[type], a, true);
  var cb = (!type) ? b: c;
  if (typeof(c) === 'undefined' && typeof(b) !== 'function') {
    cb = function(){};
  }
  xhr.onerror = function() {
    p.reject(this);
    cb(this, true);
  };
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400){
        p.resolve(this.response);
        cb(this.response, true);
      } else {
        p.reject(this);
        cb(this, true);
      }
    }
  };
  if (type) {
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send($.param(b));
  } else {
    xhr.send();
  }
  xhr = null;
  return p.promise();
};

/**
 * Deferred and When for ki.js by James Doyle (james2doyle)
 * ---
 * ki.js homepage https://github.com/dciccale/ki.js
 * Almost a straigh copy from
 * https://github.com/warpdesign/deferred-js by Nicolas Ramz
 */
(function(ki) {
  function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  }

  function foreach(arr, handler) {
    if (isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        handler(arr[i]);
      }
    } else
      handler(arr);
  }

  function D(fn) {
    var status = 'pending',
      doneFuncs = [],
      failFuncs = [],
      progressFuncs = [],
      resultArgs = [],

      promise = {
        done: function() {
          for (var i = 0; i < arguments.length; i++) {
            // skip any undefined or null arguments
            if (!arguments[i]) {
              continue;
            }

            if (isArray(arguments[i])) {
              var arr = arguments[i];
              for (var j = 0; j < arr.length; j++) {
                // immediately call the function if the deferred has been resolved
                if (status === 'resolved') {
                  arr[j].apply(this, resultArgs);
                }

                doneFuncs.push(arr[j]);
              }
            } else {
              // immediately call the function if the deferred has been resolved
              if (status === 'resolved') {
                arguments[i].apply(this, resultArgs);
              }

              doneFuncs.push(arguments[i]);
            }
          }

          return this;
        },

        fail: function() {
          for (var i = 0; i < arguments.length; i++) {
            // skip any undefined or null arguments
            if (!arguments[i]) {
              continue;
            }

            if (isArray(arguments[i])) {
              var arr = arguments[i];
              for (var j = 0; j < arr.length; j++) {
                // immediately call the function if the deferred has been resolved
                if (status === 'rejected') {
                  arr[j].apply(this, resultArgs);
                }

                failFuncs.push(arr[j]);
              }
            } else {
              // immediately call the function if the deferred has been resolved
              if (status === 'rejected') {
                arguments[i].apply(this, resultArgs);
              }

              failFuncs.push(arguments[i]);
            }
          }

          return this;
        },

        always: function() {
          return this.done.apply(this, arguments).fail.apply(this, arguments);
        },

        progress: function() {
          for (var i = 0; i < arguments.length; i++) {
            // skip any undefined or null arguments
            if (!arguments[i]) {
              continue;
            }

            if (isArray(arguments[i])) {
              var arr = arguments[i];
              for (var j = 0; j < arr.length; j++) {
                // immediately call the function if the deferred has been resolved
                if (status === 'pending') {
                  progressFuncs.push(arr[j]);
                }
              }
            } else {
              // immediately call the function if the deferred has been resolved
              if (status === 'pending') {
                progressFuncs.push(arguments[i]);
              }
            }
          }

          return this;
        },

        then: function() {
          // fail callbacks
          if (arguments.length > 1 && arguments[1]) {
            this.fail(arguments[1]);
          }

          // done callbacks
          if (arguments.length > 0 && arguments[0]) {
            this.done(arguments[0]);
          }

          // notify callbacks
          if (arguments.length > 2 && arguments[2]) {
            this.progress(arguments[2]);
          }
        },

        promise: function(obj) {
          if (typeof(obj) === 'undefined') {
            return promise;
          } else {
            for (var i in promise) {
              obj[i] = promise[i];
            }
            return obj;
          }
        },

        state: function() {
          return status;
        },

        debug: function() {
          console.log('[debug]', doneFuncs, failFuncs, status);
        },

        isRejected: function() {
          return status === 'rejected';
        },

        isResolved: function() {
          return status === 'resolved';
        },

        pipe: function(done, fail, progress) {
          return D(function(def) {
            foreach(done, function(func) {
              // filter function
              if (typeof func === 'function') {
                deferred.done(function() {
                  var returnval = func.apply(this, arguments);
                  // if a new deferred/promise is returned, its state is passed to the current deferred/promise
                  if (returnval && typeof returnval === 'function') {
                    returnval.promise().then(def.resolve, def.reject, def.notify);
                  } else { // if new return val is passed, it is passed to the piped done
                    def.resolve(returnval);
                  }
                });
              } else {
                deferred.done(def.resolve);
              }
            });

            foreach(fail, function(func) {
              if (typeof func === 'function') {
                deferred.fail(function() {
                  var returnval = func.apply(this, arguments);

                  if (returnval && typeof returnval === 'function') {
                    returnval.promise().then(def.resolve, def.reject, def.notify);
                  } else {
                    def.reject(returnval);
                  }
                });
              } else {
                deferred.fail(def.reject);
              }
            });
          }).promise();
        }
      },

      deferred = {
        resolveWith: function(context) {
          if (status === 'pending') {
            status = 'resolved';
            var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
            for (var i = 0; i < doneFuncs.length; i++) {
              doneFuncs[i].apply(context, args);
            }
          }
          return this;
        },

        rejectWith: function(context) {
          if (status === 'pending') {
            status = 'rejected';
            var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
            for (var i = 0; i < failFuncs.length; i++) {
              failFuncs[i].apply(context, args);
            }
          }
          return this;
        },

        notifyWith: function(context) {
          if (status === 'pending') {
            var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
            for (var i = 0; i < progressFuncs.length; i++) {
              progressFuncs[i].apply(context, args);
            }
          }
          return this;
        },

        resolve: function() {
          return this.resolveWith(this, arguments);
        },

        reject: function() {
          return this.rejectWith(this, arguments);
        },

        notify: function() {
          return this.notifyWith(this, arguments);
        }
      }

    var obj = promise.promise(deferred);

    if (fn) {
      fn.apply(obj, [obj]);
    }

    return obj;
  }

  var when = function() {
    if (arguments.length < 2) {
      var obj = arguments.length ? arguments[0] : undefined;
      if (obj && (typeof obj.isResolved === 'function' && typeof obj.isRejected === 'function')) {
        return obj.promise();
      } else {
        return D().resolve(obj).promise();
      }
    } else {
      return (function(args) {
        var df = D(),
          size = args.length,
          done = 0,
          rp = new Array(size); // resolve params: params of each resolve, we need to track down them to be able to pass them in the correct order if the master needs to be resolved

        for (var i = 0; i < args.length; i++) {
          (function(j) {
            var obj = null;

            if (args[j].done) {
              args[j].done(function() {
                rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
                if (++done == size) {
                  df.resolve.apply(df, rp);
                }
              })
                .fail(function() {
                  df.reject(arguments);
                });
            } else {
              obj = args[j];
              args[j] = new Deferred();

              args[j].done(function() {
                rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
                if (++done == size) {
                  df.resolve.apply(df, rp);
                }
              })
                .fail(function() {
                  df.reject(arguments);
                }).resolve(obj);
            }
          })(i);
        }
        return df.promise();
      })(arguments);
    }
  };
  /**
   * bind these new functions to ki
   */
  ki.Deferred = D;
  ki.when = D.when = when;
})($);
})();

// end of ki.extend

/**
 * Simple data attribute access for ki.js
 * 
 * @version 0.2
 * @author Fabian Wolf (@link http://usability-idealist.de/)
 * @require ki.extend.js
 */

/**
 * Is data attribute set?
 */
(function() {
	
	$.prototype.hasData = function( a ) {
		return this[0].hasAttribute( 'data-' + a );
	}; 

	/**
	 * Retrieve OR set given data attribute (multi-purpose ;))
	 */
	$.prototype.data = function( a, b ) {
		if( typeof( b ) != 'undefined' ) { // b is set, thus its set
			$(this[0]).setData( a, b );
		} else { // b is not set, thus its get
			return $(this[0]).getData( a );
		}
	};

	$.prototype.getData = function( a ) {
		//return $(this[0]).data( a );
		return this[0].getAttribute( 'data-' + a );
		
	};

	/**
	 * Set given data attribute to specific value
	 */

	$.prototype.setData = function( a, b ) {
		this[0].setAttribute( 'data-' + a, b );
	};

	$.prototype.addData = function( a, b ) {
		var c = this[0].getAttribute( 'data-' + a );
		
		c = ( typeof( c ) != 'undefined' ? c + b : b );	
		
		this[0].setAttribute( 'data-' + a, c );
	}

})();

