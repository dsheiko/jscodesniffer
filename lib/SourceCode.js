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
	* @param {function( function, Object, Object )} factory
	*/
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* A module representing SourceCode
	* @module lib/SourceCode
	*/
define(function() {
	/**
	* Abstracts source cod
	* @constructor
	* @alias module:lib/SourceCode
	* @param {string} text
	*/
	var SourceCode = function( text ) {
		if ( typeof text !== "string" ) {
			throw new TypeError( "Invalid source code" );
		}
		/** @lends module:lib/SourceCode.prototype */
		return {
			/**
			* Getter
			* @access public
			* @returns {string}
			*/
			get: function() {
				return text;
			},
      /**
       * @param {RegExp} re
       * @return {Array|null)
       */
      match: function( re ) {
        return text.match( re );
      },
			/**
			* Get index within the source code instance of the first occurrence of a given substring
			* Check if the source code instance contains a given substring === -1
			* @access public
			* @param {string} ch
			* @returns {number}
			*/
			find: function( ch ) {
				return text.indexOf( ch );
			},
			/**
			* Get an instance of the source code with a given substring removed
			* @access public
			* @param {string} ch
			* @returns {Object}
			*/
			filter: function( ch ) {
				return  new SourceCode( text.replace( new RegExp( ch, "gm" ), "" ) );
			},
			/**
			* Get length of the source code
			* @access public
			* @returns {number}
			*/
			length: function() {
				return text.length;
			},
			/**
			* Get the source code as an array of lines
			* @access public
			* @returns {array}
			*/
			asLines: function() {
				return text.split( "\n" );
			},
			/**
			* Print context (useful for debugging)
			* @access public
			* @returns {Object}
			*/
			print: function() {
				console.log([ text ]);
				return this;
			},
			/**
			* Fill in fragment of source code with a given char
			* @access public
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
			* @access public
			* @returns {Object}
			*/
			extract: function() {
				var args = arguments, lPos, rPos;
				// If range array given
				if ( Array.isArray( args[ 0 ] ) ) {
					lPos = args[ 0 ][ 0 ];
					rPos = args[ 0 ][ 1 ];
				} else {
					lPos = args[ 0 ];
					rPos = args[ 1 ];
				}
				// Boundaries
				lPos = lPos < 0 ? 0 : lPos;
				rPos = rPos >= text.length ? text.length - 1 : rPos;
				return new SourceCode( text.substr( lPos, rPos - lPos ) );
			}
		};
	};
	return SourceCode;
});

