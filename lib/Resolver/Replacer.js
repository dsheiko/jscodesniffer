/*
* @author sheiko
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* jscs standard:Jquery
* jshint unused:false
*/

/**
	* A module allowing to make replacement on source text by given token positions
	* It will take care of offsets changing with every replace
	*
	* replacer = Replacer( "123456789" );
	* replacer.replace( 3,4, "---------" );
	* replacer.get();
	*
	* @module Replacer
	* @constructor
	* @alias module:Replacer
	* @param {string} srcCode
	*/
module.exports = function( srcCode ) {
	"use strict";
	/**
	* @access private
	* @type {number[]}
	*/
	var diffs = [];
	return {
		/**
		 * Getter
		 * @returns {string}
		 */
		get: function() {
			return srcCode;
		},
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
			var offset;
			// if fragment cut, negative offset..
			offset = lPos - rPos + substr.length;
			// > lPos goes offset
			diffs.push({
				pos: lPos,
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
};
