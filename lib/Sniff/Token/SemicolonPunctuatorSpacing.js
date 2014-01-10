/*
	* @package jscodesniffer
	* @author sheiko
	* @license MIT
	* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
	* @jscs standard:Jquery
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
	* A module representing a sniffer.
	* @module Sniff/Token/SemicolonPunctuatorSpacing
	*/
define(function( require ) {
"use strict";

var utils = require( "../Utils" ),
	NAME = "SemicolonPunctuatorSpacing",
	/**
	* @constructor
	* @alias module:Sniff/Token/SemicolonPunctuatorSpacing
	*/
	Sniff = function( sourceCode, mediator ) {
	return {
	/**
		* Check contract
		* @param {Object} rule
		*/
		validateRule: function( rule ) {
		utils.validateRule( rule, "disallowPrecedingSpaces", "boolean", true );
		},
	/**
		* Run the sniffer according a given rule if a given TOKEN type matches the case
		* @param {Object} rule
		* @param {Object} token
		*/
	run: function( rule, token ) {
		var nextChar;
		if ( token.type !== "Punctuator" || token.value !== ";" || !rule.disallowPrecedingSpaces ) {
		return;
		}

		// only for statement terminator. e.g. for ( ; i < 100; i++ ) is valid
		nextChar = sourceCode.extract( token.range[ 1 ], token.range[ 1 ] + 1 );
		if ( nextChar.find( "\n" ) === -1 && nextChar.length() ) {
		return;
		}


		if ( sourceCode.extract( token.range[ 0 ] - 1, token.range[ 0 ] ).find( " " ) !== -1 ) {
		mediator.publish( "violation", NAME, "SemicolonPrecedingSpacesNotAllowed", [
			token.range[ 0 ] - 1,
			token.range[ 0 ]
		], {
			start: {
			line: token.loc.start.line,
			column: token.loc.start.column - 1
			},
			end: {
			line: token.loc.start.line,
			column: token.loc.start.column
			}
		});
		}
	}
	};
};
	return Sniff;
});