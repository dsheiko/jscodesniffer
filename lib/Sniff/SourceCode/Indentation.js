/*
* @package jscodesniffer
* @author sheiko
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* jscs standard:Jquery
* jshint unused:false
* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
*/
/*
* A module representing a sniffer.
* @module lib/Sniff/SourceCode/Indentation
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
	* @param {function( string )} require
	*/
define(function( require ) {
"use strict";
		/**
		* @type {module:lib/utilsSniff/Utils}
		* @access private
		*/
var utils = require( "../Utils" ),
		/**
		* @constant
		* @type {String}
		* @default
		* @access private
		*/
		NAME = "Indentation";
/**
* @constructor
* @alias module:lib/Sniff/SourceCode/Indentation
* @param {module:lib/SourceCode} sourceCode
* @param {module:lib/Mediator} mediator
*/
return function( sourceCode, mediator ) {
	/** @lends module:lib/Sniff/SourceCode/Indentation.prototype */
	return {
		/**
		* Check the contract
		* @access public
		* @param {Object} rule
		* @memberOf module:lib/Sniff/SourceCode/Indentation
		*/
		validateRule: function( rule ) {
			utils.validateRule( rule, "allowOnlyTabs", "boolean" );
			utils.validateRule( rule, "allowOnlySpaces", "boolean" );
			utils.validateRule( rule, "disallowMixed", "boolean" );
			utils.validateRule( rule, "ignoreBlockComments", "boolean" );
		},
		/**
		* Run the sniffer according a given rule if a given node type matches the case
		* @access public
		* @param {Object} rule
		* @param {Array} [comments]
		* @memberOf module:lib/Sniff/SourceCode/Indentation
		*/
		run: function( rule, comments ) {
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
				if ( rule.hasOwnProperty( "ignoreBlockComments" ) && rule.ignoreBlockComments &&
					that.isBlockComment( inx + 1, comments ) ) {
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
		* Find out if the line withing a block comment range
		* @param {Number} inx
		* @param {Array} comments
		* @returns {Boolean}
		*/
		isBlockComment: function( inx, comments ){
			if ( !comments ) {
				return false;
			}
			return comments.some(function( fetch ){
				return inx >= fetch.loc.start.line && inx <= fetch.loc.end.line;
			});
		},

		/**
		* Get range left position for the line associated with a given `inx`
		* @param {string[]} lines
		* @param {number} inx
		* @returns {number}
		* @memberOf module:lib/Sniff/SourceCode/Indentation
		*/
		getRangePosition: function( lines, inx ) {
			return lines.slice( 0, inx - 1 ).join( "\n" ).length;
		},
		/**
		* Give all the whitespaces (spaces and tabs) forun in the beginning fo the line
		* @access protected
		* @param {string} line
		* @returns {array}
		* @memberOf module:lib/Sniff/SourceCode/Indentation
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
		* @memberOf module:lib/Sniff/SourceCode/Indentation
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
		* @memberOf module:lib/Sniff/SourceCode/Indentation
		*/
		matchesMixedPattern: function( line ) {
			return line.indexOf( " " ) !== -1 && line.indexOf( "\t" ) !== -1;
		},

		/**
		* Report to mediator
		* @access protected
		* @param {number} line
		* @param {number} pos
		* @param {string} foundWsString
		* @param {string} errorCode
		* @param {string} expected
		* @memberOf module:lib/Sniff/SourceCode/Indentation
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
				excerpt: foundWsString,
				where: ""
			});
		}
	};
};

});