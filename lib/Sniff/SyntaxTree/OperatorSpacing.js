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
define( function ( require, exports, module ) {
"use strict";

var utils = require( "../Utils"),
    NAME = "OperatorSpacing",
    Sniff = function( sourceCode, mediator ) {

      return {
      /**
        * Check contract
        * @param {object} rule
        */
        validateRule: function( rule ) {
          utils.validateRule( rule, "allowOperatorPrecedingWhitespaces", "number", true );
          utils.validateRule( rule, "allowOperatorTrailingWhitespaces", "number", true );
        },
        /**
          * Run the sniffer according a given rule if a given node type matches the case
          * @param {object} rule
          * @param {object} node
          */
        run: function( rule, node ) {
          var that = this, lPos, rPos;

          if ( ( node.type === "AssignmentExpression" || node.type === "BinaryExpression" ) &&
              node.left && node.right && node.operator ) {

            // Find position of the operator
            lPos = node.left.range[ 1 ] +
              sourceCode.extract( node.left.range[ 1 ], node.right.range[ 0 ] ).find( node.operator );
            rPos = lPos + node.operator.length;

            // left< >operator right
            that.sniff( node.left, node.left.range[ 1 ], lPos,
              rule.allowOperatorPrecedingWhitespaces, "OperatorPrecedingWhitespaces" );

            // left operator< >right
            that.sniff( node.left, rPos, node.right.range[ 0 ],
              rule.allowOperatorTrailingWhitespaces, "OperatorTrailingWhitespaces" );


          }
        },


        /**
        * Sniff a given range
        *
        * @param {object} node
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
                expected: expected
              });
            }
          }
        }

      };
    };
  return Sniff;
});