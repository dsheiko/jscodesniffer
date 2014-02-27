/*
* @package jscodesniffer
* @author sheiko
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* jscs standard:Jquery
* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
*/
// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	/**
	* Override AMD `define` function for RequireJS
	* @param {function( function, Object, Object )} factory
	*/
var define = function ( factory ) {
	module.exports = factory( require, exports, module );
};
}
/**
* A module representing token sequence
* @module lib/TokenIterator
*/
define(function() {
/**
* Represent token sequence the way it's easy to navigate
*
* @constructor
* @alias module:lib/TokenIterator
* @param {Object[]} tokens
*/
var TokenIterator = function( tokens ) {
	/**
	* @type {number}
	* @access private
	* @memberOf module:lib/TokenIterator
	*/
	var pos = 0,
	/**
	* @type {number[]}
	* @access private
	* @memberOf module:lib/TokenIterator
	*/
		leftPosIndexMap = [],
	/**
	* @type {number[]}
	* @access private
	* @memberOf module:lib/TokenIterator
	*/
		rightPosIndexMap = [];

	// Update position X index map on the first run
	if ( !leftPosIndexMap.length ) {
		tokens.forEach(function( el, inx ){
			leftPosIndexMap[ el.range[ 0 ] ] = inx;
			rightPosIndexMap[ el.range[ 1 ] ] = inx;
		});
	}
	/** @lends module:lib/TokenIterator.prototype */
	return {
		/**
		* Iterator interface
		*/

		/**
		* Check if the end of the sequence reached
		* @access public
		* @returns {boolean}
		*/
		valid: function(){
			return typeof tokens[ pos ] !== "undefined";
		},
		/**
		* Move to the next element
		* @access public
		*/
		next: function(){
			pos++;
		},
		/**
		* Check if the end of the sequence reached
		* @access public
		* @returns {boolean}
		*/
		key: function(){
			return pos;
		},
		/**
		* Rewind the sequence
		* @access public
		*/
		rewind: function() {
			pos = 0;
		},
		/**
		* Get the current token
		* @access public
		* @returns {Object}
		*/
		current: function() {
			return tokens[ pos ];
		},
		/**
		* Move to the token corresponding given left in-code position
		* @access public
		* @param {number} lPos
		* @returns {TokenIterator}
		*/
		findByLeftPos: function( lPos ) {
			if ( typeof leftPosIndexMap[ lPos ] === "undefined" ) {
				throw new RangeError( "No token associated with the position " + lPos );
			}
			pos = leftPosIndexMap[ lPos ];
			return this;
		},
		/**
		* Move to the token corresponding given right in-code position
		* @access public
		* @param {number} rPos
		* @returns {TokenIterator}
		*/
		findByRightPos: function( rPos ) {
			if ( typeof rightPosIndexMap[ rPos ] === "undefined" ) {
				throw new RangeError( "No token associated with the position " + rPos );
			}
			pos = rightPosIndexMap[ rPos ];
			return this;
		},
		/**
			* Group boundaries are not present in the SyntaxTree,
			* find the group opening token
			* <(>((1)))
			* @access public
			* @param {number} leftBoundaryPos
			*/
		findGroupOpener: function( leftBoundaryPos ) {
			var i = 0, el;
			do {
				el = this.get( --i );
			} while( el && el.type === "Punctuator" && el.value === "(" && el.range[ 0 ] > leftBoundaryPos );
			pos = pos + i + 1;
			return this;
		},
		/**
			* Group boundaries are not present in the SyntaxTree,
			* find the group closing token
			* (((1))<)>
			* @access public
			* @param {number} rightBoundaryPos
			*/
		findGroupCloser: function( rightBoundaryPos ) {
			var i = 0, el;
			do {
				el = this.get( ++i );
			} while( el && el.type === "Punctuator" && el.value === ")" && el.range[ 1 ] < rightBoundaryPos );
			pos = pos + i - 1;
			return this;
		},
		/**
		* Get token by a given offset
		* @access public
		* @param {number} offset (can be negative)
		* @returns {object}
		*/
		get: function( offset ) {
			return tokens[ pos + offset ];
		},
		/**
		* Get an independent copy of the iterator
		* @returns {module:lib/TokenIterator} self
		*/
		clone: function() {
			return new TokenIterator( tokens );
		}
	};
};
return TokenIterator;
});
