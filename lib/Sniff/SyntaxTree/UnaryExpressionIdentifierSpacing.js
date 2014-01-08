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
    NAME = "UnaryExpressionIdentifierSpacing",
    IGNORE_OPERATORS = [ "delete", "in", "instanceof", "new", "this", "typeof", "void" ],
    Sniff = function( sourceCode, mediator ) {
  return {
    /**
      * Check contract
      * @param {object} rule
      */
      validateRule: function( rule ) {
        utils.validateRule( rule, "allowTrailingWhitespaces", "number", true );
      },
    /**
      * Run the sniffer according a given rule if a given node type matches the case
      * @param {object} rule
      * @param {object} node
      */
    run: function( rule, node ) {
        if ( node.type === "UnaryExpression" && node.operator && IGNORE_OPERATORS.indexOf( node.operator ) === -1 ) {
          this.sniff( node.argument, node, sourceCode.extract( node.range[ 0 ] + node.operator.length,
            node.argument.range[ 0 ] ).filter( "\\(" ).length(), rule.allowTrailingWhitespaces );
        }
    },
    /**
      *
      * @param {object} arg
      * @param {object} node
      * @param {number} actual
      * @param {number} expected
      */
    sniff: function( arg, node, actual, expected ) {
      var code = "UnaryExpressionValueTrailingSpacing";
      if ( actual !== expected ) {
        mediator.publish( "violation", NAME, code, [
            node.range[ 0 ],
            arg.range[ 0 ]
          ], {
            start: node.loc.start,
            end: arg.loc.start
          }, {
          actual: actual,
          expected: expected
        });
      }
    }
  };
};
  return Sniff;
});