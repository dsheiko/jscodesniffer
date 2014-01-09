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
	* @module Sniff/SyntaxTree/EmptyConstructsSpacing
	*/
define(function ( require ) {

var utils = require( "../Utils" ),
	NAME = "EmptyConstructsSpacing",
	RE_COMMENT = "\\/\\*.*?\\*\\/",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/EmptyConstructsSpacing
	*/
	SniffClass = function( sourceCode, mediator ) {
	return {
	/**
	* Check contract
	* @param {Object} rule
	*/
	validateRule: function( rule ) {
	utils.validateRule( rule, "for", "array", true );
	utils.validateRule( rule, "allowWhitespaces", "boolean", true );
	},
	/**
	* Run the sniffer according a given rule if a given node type matches the case
	* @param {Object} rule
	* @param {Object} node
	*/
	run: function( rule, node ) {
		var actual;
		if ( rule.allowWhitespaces ) {
			return;
		}
		/*
		* @TODO: can contain inline comments
		if ( rule[ "for" ].indexOf( "BlockStatement" ) !== -1 && node.type === "BlockStatement" &&
		node.hasOwnProperty( "body" ) && !node.body.length ) {
		// function fn(){< >};
		actual = sourceCode.extract( node.range[ 0 ], node.range[ 1 ] )
			.filter( "[\\{\\}]" ).filter("\\/\\*.*?\\*\\/").length();
		this.sniff( actual, node.range, node.loc );
		}
		*/
		if ( rule[ "for" ].indexOf( "ObjectExpression" ) !== -1 && node.type === "ObjectExpression" &&
		node.hasOwnProperty( "properties" ) && !node.properties.length ) {
			// var obj = { };
			actual = sourceCode
			.extract( node.range[ 0 ], node.range[ 1 ] )
			.filter( "[\\{\\}]" )
			.filter( RE_COMMENT );
			// Ignore when contains inline comments
			this.hasComments( actual ) && this.sniff( actual.length(), node.range, node.loc );
		}
		if ( rule[ "for" ].indexOf( "ArrayExpression" ) !== -1 && node.type === "ArrayExpression" &&
		node.hasOwnProperty( "elements" ) && !node.elements.length ) {
			// var arr = [ ];
			actual = sourceCode
			.extract( node.range[ 0 ], node.range[ 1 ] )
			.filter( "[\\[\\]]" )
			.filter( RE_COMMENT );
			// Ignore when contains inline comments
			this.hasComments( actual ) && this.sniff( actual.length(), node.range, node.loc );
		}

		if ( rule[ "for" ].indexOf( "FunctionDeclaration" ) !== -1 && node.type === "FunctionDeclaration" &&
		node.hasOwnProperty( "params" ) && !node.params.length ) {
			// function fn<( )>{}
			actual = sourceCode
			.extract( node.id.range[ 1 ], node.body.range[ 0 ] )
			.filter( "\\s+$" ) // remove spaces between ')' and '{'
			.filter( "[\\(\\)]" )
			.filter( RE_COMMENT );
			// Ignore when contains inline comments
			this.hasComments( actual ) && this.sniff( actual.length(), node.range, node.loc );
		}

		if ( rule[ "for" ].indexOf( "FunctionExpression" ) !== -1 && node.type === "FunctionExpression" &&
		node.hasOwnProperty( "params" ) && !node.params.length ) {
			// var fn = function(< >){}
			actual = sourceCode
			.extract( node.range[ 0 ] + 8, node.body.range[ 0 ] )
			.filter( "\\s+$" ) // remove spaces between ')' and '{'
			.filter( "[\\(\\)]" )
			.filter( RE_COMMENT );
			// Ignore when contains inline comments
			this.hasComments( actual ) && this.sniff( actual.length(), node.range, node.loc );
		}

		if ( rule[ "for" ].indexOf( "CallExpression" ) !== -1 && node.type === "CallExpression" &&
		node.hasOwnProperty( "arguments" ) && !node[ "arguments" ].length && node.callee ) {
			// fn(< >);
			actual = sourceCode
			.extract( node.range[ 0 ] +
				( node.callee.range[ 1 ] - node.callee.range[ 0 ] ), node.range[ 1 ] )
			.filter( "[\\(\\)]" )
			.filter( RE_COMMENT );
			// Ignore when contains inline comments
			this.hasComments( actual ) && this.sniff( actual.length(), node.range, node.loc );
		}
	},
	/**
		*
		* @param {object} srcCode
		* @return {Boolean}
		*/
	hasComments: function( srcCode ) {
		return srcCode.find( "//" ) === -1 && srcCode.find( "/*" ) === -1;
	},

	/**
	*
	* @param {number} actual
	* @param {number} expected
	* @param {Object} range
	* @param {Object} loc
	*/
	sniff: function( actual, range, loc ) {
		var code = "EmptyConstructsSpacing";
			if ( actual !== 0 ) {
				mediator.publish( "violation", NAME, code, range, loc, {
					actual: actual,
					expected: 0
				});
			}
		}
	};
};
	return SniffClass;
});