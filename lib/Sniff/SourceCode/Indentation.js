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
	* A module representing a sniffer.
	* @module Sniff/SourceCode/Indentation
	* @param {function} require
	*/
define(function( require ) {
"use strict";
		/**
		* @type {utilsSniff/Utils}
		*/
var utils = require( "../Utils" ),
		/**
		* @constant
		* @type {String}
		* @default
		*/
		NAME = "Indentation",
	/**
	* @constructor
	* @alias module:Sniff/SourceCode/Indentation
	* @param {SourceCode} sourceCode
	* @param {Mediator} mediator
	*/
	Sniff = function( sourceCode, mediator ) {
	return {
		/**
		* Check the contract
		* @access public
		* @param {Object} rule
		*/
		validateRule: function( rule ) {
			utils.validateRule( rule, "allowOnlyTabs", "boolean" );
			utils.validateRule( rule, "allowOnlySpaces", "boolean" );
			utils.validateRule( rule, "disallowMixed", "boolean" );
		},
		/**
		* Run the sniffer according a given rule if a given node type matches the case
		* @access public
		* @param {Object} rule
		*/
		run: function( rule ) {
			var that = this,
				lines = sourceCode.asLines();

			lines.forEach(function( line, inx ){
				var
					/**
					 * Position on the line
					 * @type {number}
					 */
					pos,
					/**
					 * @type {string[]|null}
					 */
					matches = that.getWhitespacesInTheBeginning( line );

				if ( rule.disallowMixed ) {
					if ( that.matchesMixedPattern( line ) ) {
						pos = that.getRangePosition( lines, inx );
						that.sniff( inx + 1, pos, matches[ 1 ], "MixedWhitespacesNotAllowedForIndentation", "any" );
					}
				}
				if ( !rule.allowOnlyTabs && !rule.allowOnlySpaces ) {
					return;
				}
				if ( matches && !that.matchesSpecPattern( matches[ 1 ], rule.allowOnlyTabs ) ) {
					pos = that.getRangePosition( lines, inx );
					if ( rule.allowOnlyTabs ) {
						that.sniff( inx + 1, pos, matches[ 1 ], "OnlyTabsAllowedForIndentation", "tabs" );
					} else {
						that.sniff( inx + 1, pos, matches[ 1 ], "OnlySpacesAllowedForIndentation", "spaces" );
					}
				}
			});
		},
		/**
		 * Get range left position for the line associated with a given `inx`
		 * @param {string[]} lines
		 * @param {number} inx
		 * @returns {number}
		 */
		getRangePosition: function( lines, inx ) {
			return lines.slice( 0, inx - 1 ).join( "\n" ).length;
		},
		/**
		* Give all the whitespaces (spaces and tabs) forun in the beginning fo the line
		* @access protected
		* @param {string} line
		* @returns {array}
		*/
		getWhitespacesInTheBeginning: function( line ) {
			var re = /^(\s*)/g;
			return re.exec( line );
		},
		/**
		* Test if a given line matches specified pattern
		* @access protected
		* @param {string} line
		* @param {type} reqTabs
		* @returns {Boolean}
		*/
		matchesSpecPattern: function( line, reqTabs ) {
			var re = new RegExp( ( reqTabs ? "^\t*$" : "^ *$" ), "g" );
			return re.test( line );
		},

		/**
		* Test if a given line is of mixed tbas and spaces
		* @access protected
		* @param {string} line
		* @returns {Boolean}
		*/
		matchesMixedPattern: function( line ) {
			return line.indexOf( " " ) !== -1 && line.indexOf( "\t" ) !== -1 ;
		},

		/**
		* Report to mediator
		* @access protected
		* @param {number} line
		* @param {number} pos
		* @param {string} foundWsString
		* @param {string} errorCode
		* @param {string} expected
		*/
		sniff: function( line, pos, foundWsString, errorCode, expected ) {
			var actualLen = foundWsString.length;
			mediator.publish( "violation", NAME, errorCode, [ pos, pos + actualLen ], {
				start: {
					line: line,
					column: 0
				},
				end: {
					line: line,
					column: actualLen
				}
			}, {
				actual: foundWsString,
				expected: expected,
				excerpt: foundWsString
			});
		}
	};
};

	return Sniff;
});