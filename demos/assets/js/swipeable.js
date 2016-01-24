(function(){
	"use strict";

	
	/**
	 * Swipeable content.
	 */
	function Swipeable(el){
		var THIS     = this;
		var children = el.children;
		var _offset  = 0;
		var _active;
		

		Object.defineProperties(THIS, {
			
			active: {
				get: function(){ return _active },
				set: function(input){
					
					/** Clamp input between 0 and the number of contained elements */
					var kidCount = children.length;
					if((input = +input) < 0)       input = 0;
					else if(input >= kidCount - 1) input = kidCount - 1;
					
					/** Make sure the value's different to our existing one */
					if(input !== _active){
						_active = input;
						for(var i = 0, l = kidCount; i < l; ++i)
							children[i].classList.toggle("active", input === i)
					}
				}
			},
			
			/** The distance the container's been pulled from its starting point */
			offset: {
				get: function(){ return _offset },
				set: function(i){
					if((i = +i) !== _offset){
						_offset = i;
						el.style[CSS_TRANSFORM] = xformBefore + i + "px" + xformAfter;
					}
				}
			}
		});
		
		/** Property pieces used for assigning transform values */
		var xformBefore = CSS_3D_SUPPORTED ? "translate3D(" : "translateX(";
		var xformAfter  = CSS_3D_SUPPORTED ? ",0,0)"        : ")";
		
		
		/** Determine the initial slide index */
		(function(){
			for(var i = 0, l = children.length; i < l; ++i)
				if(children[i].classList.contains("active"))
					return THIS.active = i;
			THIS.active = 0
		}());
	}




	/**
	 * Name of the CSSOM property used by this browser for CSS transforms.
	 * For instance, this will be "msTransform" in IE9, and "transform" in
	 * modern browsers.
	 *
	 * @type {String}
	 */
	var CSS_TRANSFORM = (function(n){
		s = document.documentElement.style;
		if((prop = n.toLowerCase()) in s) return prop;
		for(var prop, s, p = "Webkit Moz Ms O Khtml", p = (p.toLowerCase() + p).split(" "), i = 0; i < 10; ++i)
			if((prop = p[i]+n) in s) return prop;
		return "";
	}("Transform"));


	/**
	 * Whether 3D transforms are supported by this browser.
	 *
	 * @type {Boolean}
	 */
	var CSS_3D_SUPPORTED = (function(propName){
		var e = document.createElement("div"), s = e.style,
		v = [["translateY(", ")"], ["translate3d(0,", ",0)"]]
		try{ s[propName] = v[1].join("1px"); } catch(e){}
		return v[+!!s[propName]] === v[1];
	}(CSS_TRANSFORM));
	
	
	/** Export */
	window.Swipeable = Swipeable;
}());