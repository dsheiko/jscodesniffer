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
  * @module Sniff/SyntaxTree/OperatorSpacing
  */
define(function( require ) {
"use strict";

var utils = require( "../Utils" ),
  NAME = "OperatorSpacing",
  /**
  * @constructor
  * @alias module:Sniff/SyntaxTree/OperatorSpacing
  */
  Sniff = function( sourceCode, mediator ) {

    return {
    /**
    * Check contract
    * @param {Object} rule
    */
    validateRule: function( rule ) {
      utils.validateRule( rule, "allowOperatorPrecedingWhitespaces", "number", true );
      utils.validateRule( rule, "allowOperatorTrailingWhitespaces", "number", true );
    },
    /**
      * Run the sniffer according a given rule if a given node type matches the case
      * @param {Object} rule
      * @param {Object} node
      */
    run: function( rule, node ) {
      var that = this, lPos, rPos, offset, operatorPos;


      if ( ( node.type === "VariableDeclarator" ) &&
        node.id && node.init ) {
      // Find position of the operator
      operatorPos = node.id.range[ 1 ] +
        sourceCode.extract( node.id.range[ 1 ], node.init.range[ 0 ] ).find( "=" );

      // var foo< >= 1;
      lPos = node.id.range[ 1 ];
      rPos = operatorPos;

      that.sniff( node.id, lPos, rPos,
        rule.allowOperatorPrecedingWhitespaces, "OperatorPrecedingWhitespaces" );

      lPos = operatorPos + 1;
      rPos = node.init.range[ 0 ];

      // Case: var foo = ( bar )
      offset = this.findNextNonWhiteSpaceChar( lPos, rPos );
      rPos = offset !== -1 ? lPos + offset : rPos;

      // var foo =< >1;
      that.sniff( node.init, lPos, rPos,
        rule.allowOperatorPrecedingWhitespaces, "OperatorTrailingWhitespaces" );
      }

      if ( ( node.type === "AssignmentExpression" || node.type === "BinaryExpression" ) &&
        node.left && node.right && node.operator ) {

      // left< >operator right
      lPos = node.left.range[ 1 ];
      // Find position of the operator
      operatorPos = lPos + sourceCode.extract( node.left.range[ 1 ], node.right.range[ 0 ] ).find( node.operator );
      rPos = operatorPos;
      // Case: ( foo ) += bar
      offset = this.findPrevNonWhiteSpaceChar( lPos, rPos );
      lPos = offset !== -1 ? rPos - offset : lPos;


      that.sniff( node.left, lPos, rPos,
        rule.allowOperatorPrecedingWhitespaces, "OperatorPrecedingWhitespaces" );

      // left operator< >right
      lPos = operatorPos + node.operator.length;
      rPos = node.right.range[ 0 ];
      // Case: foo += ( bar )
      offset = this.findNextNonWhiteSpaceChar( lPos, rPos );
      rPos = offset !== -1 ? lPos + offset : rPos;

      that.sniff( node.left, lPos, rPos,
        rule.allowOperatorTrailingWhitespaces, "OperatorTrailingWhitespaces" );


      }
    },

    findPrevNonWhiteSpaceChar: function( lPos, rPos ) {
      var re = /\S/,
        match = re.exec( sourceCode.extract( lPos, rPos ).get().split( "" ).reverse().join( "" ) );
      return match ? match.index : -1;
    },

    findNextNonWhiteSpaceChar: function( lPos, rPos ) {
      var re = /\S/,
        match = re.exec( sourceCode.extract( lPos, rPos ).get() );
      return match ? match.index : -1;
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
      var fragment = sourceCode.extract( lPos, rPos );
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
        expected: expected,
        name: node.name || ""
        });
      }
      }
    }
    };
  };
  return Sniff;
});