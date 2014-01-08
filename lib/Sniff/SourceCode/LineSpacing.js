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

var NAME = "LineSpacing",
    utils = require( "../Utils" ),
    Sniff = function( sourceCode, mediator ) {
  return {
    /**
      * Check contract
      * @param {object} rule
      */
    validateRule: function( rule ) {
        utils.validateRule( rule, "allowLineTrailingSpaces", "boolean", true );
      },
      /**
      * Run the sniffer according a given rule if a given node type matches the case
      * @param {object} rule
      */
    run: function() {
      var re = /( +)$/g,
          that = this,
          lines = sourceCode.asLines();

      lines.forEach( function( line, inx ){
        var matches = re.exec( line ), pos;
        if ( matches ) {
          pos = lines.slice( 0, inx ).join( "\n" ).length;
          that.sniff( inx + 1, pos, matches[ 1 ].length, "LineTrailingSpacesNotAllowed" );
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
    sniff: function( line, pos, actual, errorCode ) {

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
          expected: 0,
          actual: actual
        });
    }
  };
};

  return Sniff;
});