// Made with milk and cookies by Nicholas Ruggeri
// https://github.com/nicholasruggeri/cookies-enabler

window.COOKIES_ENABLER = window.COOKIES_ENABLER || (function () {

    var markupClass = {
            classTrigger : 'ce-trigger',
            classMore : 'ce-more',
            classBanner : 'ce-banner',
            classIframe : 'ce-blocked-iframe'
        },
        opts, domElmts;

    var init = function (options) {

        opts = {
            elem : options.element == null ? document.getElementsByClassName('ce-elm') : document.getElementsByClassName(options.element),
            duration : options.duration == null ? '365' : options.duration,
            eventScroll : options.eventScroll == null ? false : options.eventScroll,
            bannerHTML : options.bannerHTML == null ? '<p>This website will use techincal and third party cookies to give you the best possible experience. </p> <a href="#" class="ce-trigger">Enable Cookies</a> or <a class="ce-more" href="#">Learn More</a>' : options.bannerHTML,
            preventCookies: options.preventCookies == null ? false : options.preventCookies,
            gatAnonymized: options.gatAnonymized == null ? false : options.gatAnonymized,
            whitelistedCookies : options.whitelistedCookies == null ? [] : options.whitelistedCookies
        }

        domElmts = {
            trigger :  document.getElementsByClassName(markupClass.classTrigger),
            more: document.getElementsByClassName(markupClass.classMore),
            banner : document.getElementsByClassName(markupClass.classBanner),
            iframe : document.getElementsByClassName(markupClass.classIframe)
        }

        if (getCookie() == 'Y') {

            getScripts();

        } else {
            
            createBanner();
            if(window._gaq){_gaq.push(['_trackEvent', 'Cookie-Enabler', 'Show', {'nonInteraction': 1}])}else if(window.ga){ga('send', 'event', 'Cookie Enabler', 'Show', {'nonInteraction': 1});}
            
            if (opts.eventScroll === true) {
                window.addEventListener('scroll', enableCookies );
            }

            domElmts.trigger[0].addEventListener("click", enableCookies );
            domElmts.more[0].addEventListener("click", readMore );
            
            
            if(opts.preventCookies === true){
                docReady(function() {
                    setTimeout(clearAllCookies,100)
                    // code here
                });
                //setTimeout(clearAllCookies,500);
            }
        }
    }
    
    var gatCookies = ['_utma','_utmb','_utmc','_utmz','_utmv'];

    var clearAllCookies = function(){
        var cookies = cookieQuery(); 
        for(var cookie in cookies) {
            console.log(cookie);
			if(cookie=='ce-consent') { continue; }
			if(opts.gatAnonymized === true && gatCookies.indexOf(cookie) !== -1 ) { continue; }
			if(opts.whitelistedCookies.indexOf(cookie) != -1){ continue; }
			if(!removeCookie(cookie))
			{
    			console.log('removing')
				cookiePossibleHosts=[window.location.host, '.'+window.location.host];
				//now removing subdomains
				var regexParse = new RegExp('[a-z\-0-9]{2,63}\.[a-z\.]{2,5}$');
				var urlParts = regexParse.exec(window.location.host);
				var cookieSubdomain=window.location.host.replace(urlParts[0],'').slice(0, -1);
				if(cookieSubdomain != '') cookiePossibleHosts.push(window.location.host.substr(cookieSubdomain.length));
				for(var cookiePossibleHost in cookiePossibleHosts)
				{	
					removeCookie(cookie, { path: '/',domain: cookiePossibleHosts[cookiePossibleHost] })
					
				} 
			}else{
    			//console.log('removed');
			}
		}
    }
    
    var pluses = /\+/g;
    
    var extend = function (){
        for(var i=1; i<arguments.length; i++)
            for(var key in arguments[i])
                if(arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    }
    
    var isFunction = function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
    
    var encode = function(s) {
		return encodeURIComponent(s);
	}

	var decode = function(s) {
		return decodeURIComponent(s);
	}
	
	var read = function(s, converter) {
		var value = parseCookieValue(s);
		return isFunction(converter) ? converter(value) : value;
	}

	var stringifyCookieValue=  function(value) {
		return encode(String(value));
	}
	
	var parseCookieValue = function(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
			
		}
        
		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return s;
		} catch(e) {}
	}
	
	var removeCookie = function (key, options) {
		if (cookieQuery(key) === undefined) {
			return false;
		}
		
		// Must not alter options, thus extending a fresh object...
		cookieQuery(key, '', extend({}, options, { expires: -1 }));
		return !cookieQuery(key);
	};
	
    
    var config = cookieQuery = function (key, value, options) {
		
		// Write

		if (value !== undefined && !isFunction(value)) {
			options = extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}
        
		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];
        
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');
            
			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}
			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
				
			}
		}

		return result;
	};

    var readMore = function(e){

        e.preventDefault();
        if(window._gaq){_gaq.push(['_trackEvent', 'Cookie-Enabler', 'Read more', {'nonInteraction': 1}])}else if(window.ga){ga('send', 'event', 'Cookie-Enabler', 'Read more', {'nonInteraction': 1});}
        var win = window.open(this.href, this.target);
        win.focus();
    }

    var enableCookies = function(){
        if(window._gaq){_gaq.push(['_trackEvent', 'Cookie-Enabler', 'Accept', {'nonInteraction': 1}])}else if(window.ga){ga('send', 'event', 'Cookie-Enabler', 'Accept', {'nonInteraction': 1});}
        if (getCookie() != 'Y') {
            setCookie();
            getScripts();
            //if(domElmts.iframe.length > 0){
                location.reload();
            //}
            domElmts.banner[0].style.display = 'none';

            window.removeEventListener('scroll', enableCookies );

        }

    }

    var createBanner = function(){

        var el = '<div class="'+ markupClass.classBanner +'">'
                + opts.bannerHTML
                +'</div>';

        document.body.insertAdjacentHTML('beforeend', el);

    }

    var setCookie = function(){

        var name = "ce-consent",
            value = "Y",
            date, expires;

        if ( opts.duration ) {
            date = new Date();
            date.setTime(date.getTime()+( opts.duration*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = name +"="+ value+expires +"; path=/";
    }

    var getCookie = function(){

        var name = "ce-consent",
            cookies = document.cookie.split(";"),
            i, x, y;

        for (i = 0; i < cookies.length; i++){
            x = cookies[i].substr(0,cookies[i].indexOf("="));
            y = cookies[i].substr(cookies[i].indexOf("=")+1);
            x = x.replace(/^\s+|\s+$/g,"");
            if (x == name) {
                return unescape(y);
            }
        }
    }

    var getScripts = function(){

        var n = opts.elem.length,
            documentFragment = document.createDocumentFragment(),
            i, y, s, attrib;

        for (i = 0; i < n; i++){
            s = document.createElement('script');
            s.type = 'text/javascript';
            for (y = 0; y < opts.elem[i].attributes.length; y++) {
                attrib = opts.elem[i].attributes[y];
                if (attrib.specified) {
                    if ((attrib.name != 'type') && (attrib.name != 'class')){
                        s.setAttribute(attrib.name, attrib.value);
                    }
                }
            }
            s.innerHTML = opts.elem[i].innerHTML;
            documentFragment.appendChild(s);
        }

        document.body.appendChild(documentFragment);
    }

    return {
        init: init
    };

}());


if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}


// https://github.com/jfriend00/docReady
(function(funcName, baseObj) {
    "use strict";
        funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;
    
        function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }
    
    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }
    
    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        // IE only safe when readyState is "complete", others safe when readyState is "interactive"
        if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);