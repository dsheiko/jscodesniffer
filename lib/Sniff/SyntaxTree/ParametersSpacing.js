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
    NAME = "ParametersSpacing",
    Sniff = function( sourceCode, mediator ) {

      return {
      /**
        * Check contract
        * @param {object} rule
        */
        validateRule: function( rule ) {
          utils.validateRule( rule, "allowParamPrecedingWhitespaces", "number", true );
          utils.validateRule( rule, "allowParamTrailingWhitespaces", "number", true );
        },
        /**
          * Run the sniffer according a given rule if a given node type matches the case
          * @param {object} rule
          * @param {object} node
          */
        run: function( rule, node ) {
          var that = this, last, pos;

          if ( ( node.type === "FunctionExpression" || node.type === "FunctionDeclaration" ) && node.params && node.body ) {
            // Checking preceding for each param
            pos = node.range[ 0 ] + sourceCode.extract( node.range[ 0 ], node.body.range[ 0 ] ).find( "(" );
            node.params.forEach( function( el, i ){
              // {< >param<, >param }
              that.sniff( el, i ? node.params[ i - 1 ].range[ 1 ] + 1 : pos + 1,
                el.range[ 0 ], rule.allowParamPrecedingWhitespaces, "ParamPrecedingWhitespaces" );
            });
            if ( !node.params ) {
              return;
            }
            // Checking trailing for the last param
            // { param, param< >}
            last = node.params[ node.params.length - 1 ];
            // Empty parameter list
            if ( !last ) {
              return;
            }
            pos = last.range[ 1 ] + sourceCode.extract( last.range[ 1 ], node.body.range[ 0 ] ).find( ")" );
            this.sniff( last, last.range[ 1 ], pos,
              rule.allowParamTrailingWhitespaces, "ParamTrailingWhitespaces" );

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