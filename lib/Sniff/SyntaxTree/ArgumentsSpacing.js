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
define(function( require ) {
"use strict";

var utils = require( "../Utils"),
    NAME = "ArgumentsSpacing",
    Sniff = function( sourceCode, mediator ) {

      return {
        /**
          * Check contract
          * @param {object} rule
          */
        validateRule: function( rule ) {
          utils.validateRule( rule, "allowArgPrecedingWhitespaces", "number" );
          utils.validateRule( rule, "allowArgTrailingWhitespaces", "number" );
          utils.validateRule( rule, "exceptions", "object" );
          if ( !rule.exceptions ) {
            return false;
          }
          if ( rule.exceptions.singleArg ) {
            utils.validateRule( rule.exceptions.singleArg, "for", "array", true );
            this.validateRule( rule.exceptions.singleArg );
          }
          if ( rule.exceptions.firstArg ) {
            utils.validateRule( rule.exceptions.firstArg, "for", "array", true );
            this.validateRule( rule.exceptions.firstArg );
          }
          if ( rule.exceptions.lastArg ) {
            utils.validateRule( rule.exceptions.lastArg, "for", "array", true );
            this.validateRule( rule.exceptions.lastArg );
          }
        },
        /**
          * Run the sniffer according a given rule if a given node type matches the case
          * @param {object} rule
          * @param {object} node
          */
        run: function( rule, node ) {
          var that = this;

          if ( node.type === "CallExpression" && node[ "arguments" ] && node.callee ) {

            node[ "arguments" ] && this.sniffFirst( rule, node );

            // Checking preceding for each argument
            node[ "arguments" ].forEach( function( el, i ){
              // { argument<, >argument }
              i && that.sniff( el, node[ "arguments" ][ i - 1 ].range[ 1 ] + 1,
                el.range[ 0 ], rule.allowArgPrecedingWhitespaces, "ArgPrecedingWhitespaces" );
            });

            node[ "arguments" ] && this.sniffLast( rule, node );

          }
        },

        sniffFirst: function( rule, node ) {
          var arg, expected, pos;
          if ( !node[ "arguments" ].length ) {
            return;
          }
          // Checking trailing for the first argument
          // {< >param, param }

          arg = node[ "arguments" ][ 0 ];
          expected = rule.allowArgPrecedingWhitespaces;

          if ( rule.exceptions.firstArg && rule.exceptions.firstArg[ "for" ].indexOf( arg.type ) !== -1 ) {
            expected = rule.exceptions.singleArg.allowArgPrecedingWhitespaces;
          }

          if ( rule.exceptions.singleArg && node[ "arguments" ].length === 1 &&
            rule.exceptions.singleArg[ "for" ].indexOf( arg.type ) !== -1 ) {
            // Idiomatic: foo("bar");
            if ( arg.type !== "Literal" || typeof arg.value === "string" ) {
              expected = rule.exceptions.singleArg.allowArgPrecedingWhitespaces;
            }
          }

          pos = node.callee.range[ 1 ] + sourceCode.extract( node.callee.range[ 1 ], arg.range[ 0 ] ).find( "(" );


          this.sniff( arg, pos + 1, arg.range[ 0 ], expected, "ArgPrecedingWhitespaces" );
        },

        sniffLast: function( rule, node ) {
          var arg, expected, pos;
          if ( !node[ "arguments" ].length ) {
            return;
          }
          // Checking trailing for the last argument
          // { param, param< >}

          arg = node[ "arguments" ][ node[ "arguments" ].length - 1 ];
          expected = rule.allowArgTrailingWhitespaces;

          if ( rule.exceptions.lastArg && rule.exceptions.lastArg[ "for"  ].indexOf( arg.type ) !== -1 ) {
            expected = rule.exceptions.singleArg.allowArgTrailingWhitespaces;
          }

          if ( rule.exceptions.singleArg && node[ "arguments" ].length === 1 &&
                  rule.exceptions.singleArg[ "for" ].indexOf( arg.type )!== -1 ) {
            // Idiomatic: foo("bar");
            if ( arg.type !== "Literal" || typeof arg.value === "string" ) {
              expected = rule.exceptions.singleArg.allowArgTrailingWhitespaces;
            }
          }

          pos = arg.range[ 1 ] + sourceCode.extract( arg.range[ 1 ], node.range[ 1 ] ).find( ")" );

          this.sniff( arg, arg.range[ 1 ], pos,
              expected, "ArgTrailingWhitespaces" );
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