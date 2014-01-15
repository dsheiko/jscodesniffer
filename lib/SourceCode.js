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
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* A module representing SourceCode
	* @module SourceCode
	*/
define(function() {
	/**
	* Abstracts source cod
	* @constructor
	* @alias module:SourceCode
	* @param {string} text
	*/
	var SourceCode = function( text ) {
		if ( typeof text !== "string" ) {
		throw new TypeError( "Invalid source code" );
		}
		return {
		/**
		* @return {string}
		*/
		get: function() {
			return text;
		},
		/**
		* Get index within the source code instance of the first occurrence of a given substring
		* Check if the source code instance contains a given substring === -1
		* @param {string} ch
		* @return {number}
		*/
		find: function( ch ) {
			return text.indexOf( ch );
		},
		/**
			* Get an instance of the source code with a given substring removed
			* @param {string} ch
			* @return {Object}
			*/
		filter: function( ch ) {
			return  new SourceCode( text.replace( new RegExp( ch, "gm" ), "" ) );
		},
		/**
			* Get length of the source code
			* @returns {number}
			*/
		length: function() {
			return text.length;
		},
		/**
			* Get the source code as an array of lines
			* @returns {array}
			*/
		asLines: function() {
			return text.split( "\n" );
		},
		/**
		* Print context (useful for debugging)
		* @returns {Object}
		*/
		print: function() {
			console.log([ text ]);
			return this;
		},
		/**
		* Fill in fragment of source code with a given char
		* @param {number} lPos
		* @param {number} rPos
		* @param {string} rChar
		* @returns {Object}
		*/
		fill: function( lPos, rPos, rChar ) {
			var reWs = /\s/g,
				reAny = /./g;
			rChar = rChar || " ";
			return new SourceCode(
			text.substr( 0, lPos ) +
			text
				.substr( lPos, rPos - lPos )
				.replace( reWs, rChar )
				.replace( reAny, rChar ) +
			text.substr( rPos ) );
		},
		/**
			* Get an instance from the source code reduced according to given left and right positions
			* @param {number} lPos
			* @param {number} rPos
			* @returns {Object}
			*/
		extract: function( lPos, rPos ) {
			return new SourceCode( text.substr( lPos, rPos - lPos ) );
		}
		};
	};
	return SourceCode;
});

