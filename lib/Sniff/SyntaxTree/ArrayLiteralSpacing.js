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
define( function ( require ) {
"use strict";

var utils = require( "../Utils"),
    NAME = "ArrayLiteralSpacing",
    Sniff = function( sourceCode, mediator ) {

      return {
        /**
          * Check contract
          * @param {object} rule
          */
          validateRule: function( rule ) {
          utils.validateRule( rule, "allowElementPrecedingWhitespaces", "number", true );
          utils.validateRule( rule, "allowElementTrailingWhitespaces", "number", true );
          },
        /**
          * Run the sniffer according a given rule if a given node type matches the case
          * @param {object} rule
          * @param {object} node
          */
        run: function( rule, node ) {
          var that = this, last;

          if ( node.type === "ArrayExpression" && node.elements && node.elements.length ) {
            // Checking preceding for each element
            node.elements.forEach( function( el, i ){
              // {< >element<, >element }
              that.sniff( el, i ? node.elements[ i - 1 ].range[ 1 ] + 1 : node.range[ 0 ] + 1,
                el.range[ 0 ], rule.allowElementPrecedingWhitespaces, "ArraylElementPrecedingSpacing" );
            });
            // Checking trailing for the last element
            // { element, element< >}
            last = node.elements[ node.elements.length -1 ];
            this.sniff( last, last.range[ 1 ], node.range[ 1 ] - 1,
              rule.allowElementTrailingWhitespaces, "ArraylElementTrailingSpacing" );
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