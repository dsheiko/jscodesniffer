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
	* @module Sniff/SyntaxTree/ChainedMethodCallsSpacing
	*/
define(function( require ) {
"use strict";

var utils = require( "../Utils" ),
	NAME = "ChainedMethodCallsSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/ChainedMethodCallsSpacing
	*/
	Sniff = function( sourceCode, mediator ) {
	var members = [], chainCode, chainCodeOffset = 0;
	return {
		/**
		* Check contract
		* @param {Object} rule
		*/
		validateRule: function( rule ) {
		utils.validateRule( rule, "allowTrailingObjectWhitespaces", "number" );
		utils.validateRule( rule, "allowPrecedingPropertyWhitespaces", "number" );
		utils.validateRule( rule, "allowOnePerLineWhenMultilineCaller", "boolean" );
	},

	/**
		* Iterate through the chain
		* @param {Object} node (CallExpression)
		* @param {function} fn Callback
		*/
	iterateChain: function( node, fn ) {
		node.object && node.object.type !== "Identifier" && this.iterateChain( node.object, fn );
		node.callee && this.iterateChain( node.callee, fn );
		fn( node );
	},
	/**
		* Find all argumnets and replace the code covering them with a space
		* @param {Object} node
		*/
	excludeArgsFromChainCode: function( node ) {
		var lPos, rPos;
		if ( node[ "arguments" ] && node[ "arguments" ][ 0 ] ) {
		lPos = node[ "arguments" ][ 0 ].range[ 0 ];
		rPos = node[ "arguments" ][ node[ "arguments" ].length - 1 ].range[ 1 ];
		chainCode = chainCode.fill( lPos - chainCodeOffset, rPos - chainCodeOffset, " " );
		}
	},
	/**
		* Extract all the members of a chained call
		* @param {Object} node (CallExpression)
		* @param {function} fn Callback
		*/
	findMembers: function( node ) {
		if ( node.property ) {
		members.push( node.property );
		}
		if ( node.object && node.object.type === "Identifier" ) {
		members.push( node.object );
		}
	},
	/**
		* Iterate members and trigger violations every time a member found on the same line with previous one
		* @param {array} members
		*/
	sniffMembersOnDistinctLines: function( members ) {
		members.forEach(function( member ) {
		var sameLineMem = members.filter(function( m ){
		return m.loc.start.line === member.loc.start.line;
		});
		if ( sameLineMem.length > 1 ) {
		mediator.publish( "violation", NAME, "ChainedMethodCallsOnePerLine", member.range, member.loc, {});
		}
		});
	},

	/**
		* Run the sniffer according a given rule if a given node type matches the case
		* @param {Object} rule
		* @param {Object} node
		* @param {Object} pNode
		*/
	run: function( rule, node, pNode ) {
		var that = this, pos;

		// find root of a chain
		if ( rule.allowOnePerLineWhenMultilineCaller &&
		pNode.type !== "MemberExpression" &&
		node.type === "CallExpression" &&
		node.callee &&
		node.callee.type === "MemberExpression" &&
		node.callee.computed === false  ) {

		chainCodeOffset = node.range[ 0 ];
		chainCode = sourceCode.extract( chainCodeOffset, node.range[ 1 ] );
		// Multiline
		if ( chainCode.find( "\n" ) !== -1 ) {
		members = [];
		this.iterateChain( node, function( node ) {
		that.excludeArgsFromChainCode( node );
		that.findMembers( node );
		});
		// Now we've removed arguments from chain code. Is it still multiline?
		if ( chainCode.filter( "[\\(\\)]" ).find( "\n" ) !== -1 ) {
		this.sniffMembersOnDistinctLines( members );
		}
		}
		}

		if ( node.type === "MemberExpression" && node.object && node.property && node.computed === false ) {

		pos = node.object.range[ 1 ] + sourceCode
		.extract( node.object.range[ 1 ], node.property.range[ 0 ] )
		.find( "." );

		if ( rule.hasOwnProperty( "allowTrailingObjectWhitespaces" ) ) {
		// object< >.property
		this.sniff( node.object, node.object.range[ 1 ], pos,
		rule.allowTrailingObjectWhitespaces, "ChainedMethodCallsTrailingObjectWhitespaces" );
		}
		if ( rule.hasOwnProperty( "allowPrecedingPropertyWhitespaces" ) ) {
		// object.< >property
		this.sniff( node.object, pos + 1, node.property.range[ 0 ],
		rule.allowPrecedingPropertyWhitespaces, "ChainedMethodCallsPrecedingPropertyWhitespaces" );
		}
		}
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
		var fragment = sourceCode.extract( lPos, rPos ).filter( "," );

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