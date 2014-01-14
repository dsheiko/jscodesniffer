/*
	* @package jscodesniffer
	* @author sheiko
	* @license MIT
	* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
	* @jscs standard:Jquery
	* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
	*
	* Iterator is the main actor object through the application. Sniffer traverses tokens sequence till the stop condition.
	* In order to find out surroundings of the current tokens the API provides following navigation methods:
	*
	* instance.current() - the same as instance.get(0)
	* instance.get(N positive value) - next N's token
	* instance.get(N negative value) - prev N's token
	*
	*/
// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* A module representing token sequence
	* @module TokenIterator
	*/
define(function() {
	/**
	* Represent token sequence the way it's easy to navigate
	*
	* @constructor
	* @alis module:TokenIterator
	* @param {Object[]} tokens
	* @param {Object.<number, number>} posIndexMapInjection
	* @returns {TokenIterator}
	*/
	var TokenIterator = function( tokens, posIndexMapInjection ) {
		var pos = 0,
				posIndexMap = posIndexMapInjection || [];
		// Update position X index map on the first run
		if ( !posIndexMap.length ) {
			tokens.forEach(function( el, inx ){
				posIndexMap[ el.range[ 0 ] ] = inx;
			});
		}
		return {

			/**
			* Iterator interface
			*/

		  /**
			* Check if the end of the sequence reached
			* @returns {boolean}
			*/
			valid: function(){
				return typeof tokens[ pos ] !== "undefined";
			},
			/**
			* Move to the next element
			*/
			next: function(){
				pos++;
			},
			/**
			* Check if the end of the sequence reached
			* @returns {boolean}
			*/
			key: function(){
				return pos;
			},
			/**
			* Rewind the sequence
			*/
			rewind: function() {
				pos = 0;
			},
			/**
			* Get the current token
			* @returns {Object}
			*/
			current: function() {
				return tokens[ pos ];
			},
			/**
			* Move to the token corresponding given in-code position
			* @param {number} lPos
			* @returns {TokenIterator}
			*/
			findByPos: function( lPos ) {
				if ( typeof posIndexMap[ lPos ] === "undefined" ) {
					throw new RangeError( "No token associated with the position " + lPos );
				}
				pos = posIndexMap[ lPos ];
				return this;
			},
			/**
			 * Group boundaries are not present in the SyntaxTree,
			 * find the group opening token
			 * <(>((1)))
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
			 * @param {number} rightBoundaryPos
			 */
			findGroupCloser: function( rightBoundaryPos ) {
				var i = 0, el;
				do {
					el = this.get( ++i );
				} while( el.type === "Punctuator" && el.value === "(" && el.range[ 1 ] < rightBoundaryPos );
				pos = pos + i - 1;
				return this;
			},
			/**
			* Get token by a given offset
			* @param {number} offset (can be negative)
			* @return {object}
			*/
			get: function( offset ) {
				return tokens[ pos + offset ];
			}
		};
	};
	return TokenIterator;
});
