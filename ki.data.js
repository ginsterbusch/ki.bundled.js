/**
 * Simple data attribute access for ki.js
 * https://github.com/ginsterbusch/ki.bundled.js
 * 
 * @version 0.2
 * @author Fabian Wolf (@link http://usability-idealist.de/)
 * @license MIT (@link https://github.com/ginsterbusch/ki.bundled.js/blob/master/LICENSE)
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
