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
	* @module Sniff/SyntaxTree/TernaryConditionalPunctuatorsSpacing
	* @param {function} require
	*/
define(function( require ) {

		/**
		* @type {utilsSniff/Utils}
		*/
var utils = require( "../Utils" ),
		/**
		* @constant
		* @type {String}
		* @default
		*/
		NAME = "TernaryConditionalPunctuatorsSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/TernaryConditionalPunctuatorsSpacing
	* @param {SourceCode} sourceCode
	* @param {Mediator} mediator
	* @param {TokenIterator} tokenIterator
	*/
	Sniff = function( sourceCode, mediator, tokenIterator ) {
		/**
		* @type {Mixin}
		*/
		var mixin = utils.Mixin( sourceCode, mediator, NAME );
		return {
			/**
			* Check the contract
			* @access public
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "allowTestTrailingWhitespaces", "number" );
				utils.validateRule( rule, "allowConsequentPrecedingWhitespaces", "number" );
				utils.validateRule( rule, "allowConsequentTrailingWhitespaces", "number" );
				utils.validateRule( rule, "allowAlternatePrecedingWhitespaces", "number" );
			},
			/**
				* Run the sniffer according a given rule if a given node type matches the case
				* @access public
				* @param {Object} rule
				* @param {Object} node
				*/
			run: function( rule, node ) {
				var tokenIt,
						leftBoundary,
						rightBoundary;

				if ( node.type === "ConditionalExpression" && node.test && node.consequent && node.alternate ) {

					// Ignore for nesting if the corresponding ruleset is disabled
					if ( rule.ifNesting === false && node.isNesting ) {
						return;
					}
						// Override rules when nesting and corresponding rules defined
					if ( rule.ifNesting && node.isNesting ) {
						rule = rule.ifNesting;
					}


					leftBoundary = node.range[ 0 ];
					rightBoundary = node.range[ 1 ];

					// test< >? consequent : alternate
					tokenIt = tokenIterator
							.findByRightPos( node.test.range[ 1 ] )
							.findGroupCloser( rightBoundary );

					mixin.sniffExcerpt( tokenIt.get( 0 ), tokenIt.get( 1 ),
						rule.allowTestTrailingWhitespaces, "TernaryConditionalTestTrailingWhitespaces" );

					// test ?< >consequent : alternate
					tokenIt = tokenIterator
							.findByLeftPos( node.consequent.range[ 0 ] )
							.findGroupOpener( leftBoundary );

						mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
							rule.allowConsequentPrecedingWhitespaces, "TernaryConditionalConsequentPrecedingWhitespaces" );

					// test ? consequent< >: alternate
					tokenIt = tokenIterator
							.findByRightPos( node.consequent.range[ 1 ] )
							.findGroupCloser( rightBoundary );

					mixin.sniffExcerpt( tokenIt.get( 0 ), tokenIt.get( 1 ),
						rule.allowConsequentTrailingWhitespaces, "TernaryConditionalConsequentTrailingWhitespaces" );

					// test ? consequent :< >alternate
					tokenIt = tokenIterator
							.findByLeftPos( node.alternate.range[ 0 ] )
							.findGroupOpener( leftBoundary );

						mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
							rule.allowAlternatePrecedingWhitespaces, "TernaryConditionalAlternatePrecedingWhitespaces" );

				}
			}

		};
	};
	return Sniff;
});