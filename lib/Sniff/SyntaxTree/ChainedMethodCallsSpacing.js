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
    NAME = "ChainedMethodCallsSpacing",
    Sniff = function( sourceCode, mediator ) {

      return {
          /**
          * Check contract
          * @param {object} rule
          */
          validateRule: function( rule ) {
          utils.validateRule( rule, "allowTrailingObjectWhitespaces", "number" );
          utils.validateRule( rule, "allowPrecedingPropertyWhitespaces", "number" );
        },
        /**
          * Run the sniffer according a given rule if a given node type matches the case
          * @param {object} rule
          * @param {object} node
          */
        run: function( rule, node ) {
          var pos;

          if ( node.type === "MemberExpression" && node.object && node.property ) {

            pos = node.object.range[ 1 ] + sourceCode.extract( node.object.range[ 1 ], node.property.range[ 0 ] )
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
        * @param {object} node
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