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
	* @module Sniff/SyntaxTree/ObjectLiteralSpacing
	*/
define(function( require ) {
"use strict";

var utils = require( "../Utils" ),
	NAME = "ObjectLiteralSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/ObjectLiteralSpacing
	*/
	Sniff = function( sourceCode, mediator ) {

		return {
		/**
			* Check contract
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
			utils.validateRule( rule, "allowKeyPrecedingWhitespaces", "number", true );
			utils.validateRule( rule, "allowKeyTrailingWhitespaces", "number", true );
			utils.validateRule( rule, "allowValuePrecedingWhitespaces", "number", true );
			utils.validateRule( rule, "allowValueTrailingWhitespaces", "number", true );
			},
		/**
			* Run the sniffer according a given rule if a given node type matches the case
			* @param {Object} rule
			* @param {Object} node
			*/
		run: function( rule, node ) {
			var that = this, last;

			// a = { prop: 1 }
			if ( node.type === "ObjectExpression" && node.properties.length ) {

			// Checking preceding for each property
			node.properties.forEach(function( prop, i ){
				// {< >key: value<, >key: value }
				var rPos = prop.key.range[ 0 ],
					lPos = i ? node.properties[ i - 1 ].value.range[ 1 ] + 1 : node.range[ 0 ] + 1,
					coPos = that.getCommaPos( lPos, rPos ),
					sePos = that.getSemicolonPos( prop.key.range[ 1 ], prop.value.range[ 0 ] );

				that.sniff( prop, coPos, rPos, rule.allowKeyPrecedingWhitespaces,
				"ObjectPropertyKeyPrecedingSpacing" );

				// { key<>: value, key<>: value }
				lPos = prop.key.range[ 1 ];
				that.sniff( prop, lPos, sePos, rule.allowKeyTrailingWhitespaces,
				"ObjectPropertyKeyTrailingSpacing" );

				// { key:< >value, key:< >value }
				rPos = prop.value.range[ 0 ];
				prop.value.type !== "NewExpression" && that.sniff( prop, sePos, rPos, rule.allowValuePrecedingWhitespaces,
				"ObjectPropertyValuePrecedingSpacing" );
			});


			// Checking trailing for the last property
			// { key: value, key: value< >}
			last = node.properties[ node.properties.length - 1 ];
			this.sniff( last.value, last.value.range[ 1 ], node.range[ 1 ] - 1,
				rule.allowValueTrailingWhitespaces, "ObjectPropertyValueTrailingSpacing" );
			}
		},


		/**
		* @param {number} lPos
		* @param {number} rPos
		* @return {number}
		*/
		getSemicolonPos: function( lPos, rPos ) {
			var relPos = sourceCode.extract( lPos, rPos ).find( ":" );
			return relPos === -1 ? lPos : lPos + relPos;
		},
		/**
		* @param {number} lPos
		* @param {number} rPos
		* @return {number}
		*/
		getCommaPos: function( lPos, rPos ) {
			var relPos = sourceCode.extract( lPos, rPos ).find( "," );
			return relPos === -1 ? lPos : lPos + relPos;
		},


		/**
		* Sniff a given range
		*
		* @param {Object} node
		* @param {number} lPos
		* @param {number} rPos
		* @param {number} expected
		* @param {string} errorCode
		*/
		sniff: function( node, lPos, rPos, expected, errorCode ) {
			var fragment = sourceCode.extract( lPos, rPos ).filter( "[,:\\(\\)]" );
			if ( fragment.find( "\n" ) === -1 ) {
			if ( fragment.length() !== expected ) {
				mediator.publish( "violation", NAME, errorCode, [ lPos, rPos ], {
				start: node.loc.start,
				end: {
					line: node.loc.start.line,
					column: node.loc.start.column + ( rPos - lPos )
				}
				}, {
				actual: fragment.length(),
				expected: expected
				});
			}
			}
		}

		};
	};
	return Sniff;
});