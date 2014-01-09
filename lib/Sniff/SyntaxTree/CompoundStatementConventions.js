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
	* @module Sniff/SyntaxTree/CompoundStatementConventions
	*/
define(function ( require ) {

var utils = require( "../Utils" ),
	NAME = "CompoundStatementConventions",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/CompoundStatementConventions
	*/
	CompoundStatementConventions = function( sourceCode, mediator ) {
	return {
	/**
		* Check contract
		* @param {Object} rule
		*/
		validateRule: function( rule ) {
		utils.validateRule( rule, "for", "array" );
		utils.validateRule( rule, "requireBraces", "boolean" );
		utils.validateRule( rule, "requireMultipleLines", "boolean" );
		},
	/**
		* Run the sniffer according a given rule if a given node type matches the case
		* @param {Object} rule
		* @param {Object} node
		*/
	run: function( rule, node ) {

		if ( rule[ "for" ].indexOf( node.type ) !== -1 ) {
			// Conditional statements e.g. IfStatement
			if ( node.consequent ) {
			this.sniffRequireBraces( node.consequent, rule.requireBraces );
			this.sniffRequireMultipleLines( node.consequent, rule.requireMultipleLines );
			}
			// Iterating statements e.g. ForStatement
			if ( node.body ) {
			this.sniffRequireBraces( node.body, rule.requireBraces );
			this.sniffRequireMultipleLines( node.body, rule.requireMultipleLines );
			}
			// Special cases e.g. TryStatement
			if ( node.block ) {
			this.sniffRequireBraces( node.block, rule.requireBraces );
			this.sniffRequireMultipleLines( node.block, rule.requireMultipleLines );
			}
			// SwitchStatement has no block statement reflected in syntax tree
			if ( node.type === "SwitchStatement" ) {
			this.sniffRequireMultipleLines( node, rule.requireMultipleLines );
			}
		}

	},
	/**
		*
		* @param {Object} node
		* @param {boolean} isRequired
		*/
	sniffRequireBraces: function( node, isRequired ) {
		var code = "CompoundStatementRequireBraces";
		if ( isRequired && node.type !== "BlockStatement" ) {
		mediator.publish( "violation", NAME, code, node.range, node.loc );
		}
	},
	/**
		*
		* @param {Object} node
		* @param {boolean} isRequired
		*/
	sniffRequireMultipleLines: function( node, isRequired ) {
		var code = "CompoundStatementRequireMultipleLines";
		if ( isRequired && sourceCode.extract( node.range[ 0 ], node.range[ 1 ] ).find( "\n" ) === -1 ) {
		mediator.publish( "violation", NAME, code, node.range, node.loc );
		}
	}
	};
};
	return CompoundStatementConventions;
});