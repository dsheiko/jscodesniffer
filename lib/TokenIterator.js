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
	* @param {Object.<number, number>} posIndexMap
	* @returns {TokenIterator}
	*/
	var TokenIterator = function( tokens, posIndexMap ) {
		var pos = 0;
		// Update position X index map on the first run
		if ( !posIndexMap ) {
			tokens.forEach(function( el, inx ){
				posIndexMap[ el.range[ 0 ] ] = inx;
			});
		}
		return {
			/**
			* Iterator interface
			*/
			valid: function(){
				return typeof tokens[ pos ] !== "undefined";
			},
			next: function(){
				pos++;
			},
			key: function(){
				return pos;
			},
			rewind: function() {
				pos = 0;
			},
			current: function() {
				return tokens[ pos ];
			},
			/**
			*
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
				* Return token by a given offset
				* @param int offset (can be negative)
				* @return {object}
				*/
			get: function( offset ) {
				return tokens[ pos + offset ];
			}
		};
	};
	return TokenIterator;
});
