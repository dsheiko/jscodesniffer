/*
	* @package jscodesniffer
	* @author sheiko
	* @license MIT
	* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
	* jscs standard:Jquery
	* jshint unused:false
	* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
	*/

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	/**
	* Override AMD `define` function for RequireJS
	* @param {function} factory
	*/
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* A module allowing to make replacement on source text by given token positions
	* It will take care of offsets changing with every replace
	*
	* replacer = Replacer( "123456789" );
	* console.log( replacer.replace(3,4, "---------") ); //
	*	console.log( replacer.replace(5,5, "***") );
	*	console.log( replacer.replace(7,7, " ") );
	*	
	* @module Resolver/Replacer
	*/
define(function() {
	/**
	 * @constructor
	 * @alias module:Resolver/Replacer
	 * @param {string} srcCode
	 */
	return function( srcCode ) {
		/**
		 * @access private
		 * @var {number[]}
		 */
		var diffs = [];
		return {
			/**
			 * @access public
			 * @param {number} lPos
			 * @param {number} rPos
			 * @param {string} substr
			 */
			replace: function( lPos, rPos, substr ) {
				var leftOffset, rightOffset;
				if ( lPos > rPos ) {
					throw new RangeError( "Left position must be lesser than right one" );
				}
				leftOffset = this.inferOffset( lPos );
				rightOffset = this.inferOffset( rPos );
				console.log(leftOffset, rightOffset);
				srcCode = srcCode.substr( 0, lPos + leftOffset ) + substr + srcCode.substr( rPos + rightOffset );
				this.updateOffset( lPos, rPos, substr );
				return srcCode;
			},
			/**
			 * @access protected
			 * @param {number} lPos
			 * @param {number} rPos
			 * @param {string} substr
			 */
			updateOffset: function( lPos, rPos, substr ) {
				var offset
				offset = rPos - lPos + substr.length;
				// > rPos goes offset
				diffs.push({
					pos: rPos,
					offset: offset
				});
			},
			/**
			 * Calc offset for a given position based on all the previous diffs
			 * @access protected
			 * @param {number} pos
			 */
			inferOffset: function( pos ) {
				var offset = 0;
				diffs.forEach(function( diff ){
					if ( pos > diff.pos ) {
						offset += diff.offset;
					}
				});
				return offset;
			}
		};
	}
});