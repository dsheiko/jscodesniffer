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
	* @module Sniff/SourceCode/Indentation
	*/
define(function( require ) {
"use strict";

var NAME = "Indentation",
	utils = require( "../Utils" ),
	/**
	* @constructor
	* @alias module:Sniff/SourceCode/Indentation
	*/
	Sniff = function( sourceCode, mediator ) {
	return {
	/**
	* Check contract
	* @param {Object} rule
	*/
	validateRule: function( rule ) {
	utils.validateRule( rule, "allowOnlyTabs", "boolean" );
	utils.validateRule( rule, "allowOnlySpaces", "boolean" );
	},
	/**
	* Run the sniffer according a given rule if a given node type matches the case
	* @param {Object} rule
	*/
	run: function( rule ) {
	var that = this,
		lines = sourceCode.asLines();

	if ( !rule.allowOnlyTabs && !rule.allowOnlySpaces ) {
	return;
	}
	lines.forEach(function( line, inx ){
	var pos, matches = that.getWhitespacesInTheBeginning( line );
	if ( matches && !that.matchesSpecPattern( matches[ 1 ], rule.allowOnlyTabs ) ) {
		pos = lines.slice( 0, inx ).join( "\n" ).length;
		that.sniff( inx + 1, pos, matches[ 1 ].length, rule.allowOnlyTabs ?
		"OnlyTabsAllowedForIndentation" : "OnlySpacesAllowedForIndentation" );
	}
	});
	},
	/**
	* Give all the whitespaces (spaces and tabs) forun in the beginning fo the line
	* @param {string} line
	* @returns {array}
	*/
	getWhitespacesInTheBeginning: function( line ) {
	var re = /^(\s*)/g;
	return re.exec( line );
	},
	/**
	* Test if a given line matches specified pattern
	* @param {string} line
	* @param {type} reqTabs
	* @returns {Boolean}
	*/
	matchesSpecPattern: function( line, reqTabs ) {
	var re = new RegExp( ( reqTabs ? "^\t*$" : "^ *$" ), "g" );
	return re.test( line );
	},
	/**
	* Sniff a given range
	*
	* @param {number} line
	* @param {number} pos
	* @param {number} actual
	* @param {string} errorCode
	*/
	sniff: function( line, pos, actual, errorCode ) {

	mediator.publish( "violation", NAME, errorCode, [ pos, pos + actual ], {
		start: {
		line: line,
		column: 0
		},
		end: {
		line: line,
		column: actual
		}
	});
	}
	};
};

	return Sniff;
});