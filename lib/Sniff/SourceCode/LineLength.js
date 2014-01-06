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

var NAME = "LineLength",
    utils = require( "../Utils" ),
    Sniff = function( sourceCode, mediator ) {
  return {
    /**
      * Check contract
      * @param {object} rule
      */
    validateRule: function( rule ) {
        utils.validateRule( rule, "allowMaxLength", "number" );
        utils.validateRule( rule, "allowMinLength", "number" );
      },
      /**
      * Run the sniffer according a given rule if a given node type matches the case
      * @param {object} rule
      */
    run: function( rule ) {
      var that = this,
          lines = sourceCode.asLines();

      if ( !rule.hasOwnProperty( "allowMaxLength" ) && !rule.hasOwnProperty( "allowMinLength" ) ) {
        return;
      }

      lines.forEach( function( line, inx ){
        var pos = lines.slice( 0, inx ).join( "\n" ).length;
        if ( rule.hasOwnProperty( "allowMaxLength" ) && line.length > rule.allowMaxLength ) {
          that.sniff( inx + 1, pos, line.length, rule.allowMaxLength, "ExceededLineMaxLength" );
        }
        if ( rule.hasOwnProperty( "allowMinLength" ) && line.length < rule.allowMinLength ) {
          that.sniff( inx + 1, pos, line.length, rule.allowMaxLength, "DeceedLineMinLength" );
        }
      });
    },
    /**
    * Sniff a given range
    *
    * @param {number} line
    * @param {number} pos
    * @param {number} actual
    * @param {string} errorCode
    */
    sniff: function( line, pos, actual, expected, errorCode ) {

        mediator.publish( "violation", NAME, errorCode, [ pos, pos + actual ], {
          start: {
            line: line,
            column: 0
          },
          end: {
            line: line,
            column: actual
          }
        }, {
          expected: expected,
          actual: actual
        });
    }
  };
};

  return Sniff;
});