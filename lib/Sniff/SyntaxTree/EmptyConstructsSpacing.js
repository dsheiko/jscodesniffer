/*
 * @package jscodesniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === 'object' && typeof define !== 'function' ) {
    var define = function ( factory ) {
        module.exports = factory( require, exports, module );
    };
}
define(function ( require, exports, module ) {

var utils = require( "../Utils"),
    NAME = "EmptyConstructsSpacing",
    SniffClass = function( sourceCode, mediator ) {
  return {
    /**
     * Check contract
     * @param {object} rule
     */
     validateRule: function( rule ) {
        utils.validateRule( rule, "for", "array", true );
        utils.validateRule( rule, "allowWhitespaces", "boolean", true );
     },
    /**
     * Run the sniffer according a given rule if a given node type matches the case
     * @param {object} rule
     * @param {object} node
     */
    run: function( rule, node ) {
      if ( rule.allowWhitespaces ) {
        return;
      }
      if ( rule[ "for" ].indexOf( "BlockStatement" ) !== -1 && node.type === "BlockStatement" &&
        node.hasOwnProperty( "body" ) && !node.body.length ) {
        this.sniff( node.range[ 1 ] - node.range[ 0 ] - 2 , node.range, node.loc );
      }

      if ( rule[ "for" ].indexOf( "ObjectExpression" ) !== -1 && node.type === "ObjectExpression" &&
        node.hasOwnProperty( "properties" ) && !node.properties.length ) {
        this.sniff( node.range[ 1 ] - node.range[ 0 ] - 2, node.range, node.loc );
      }
      if ( rule[ "for" ].indexOf( "ArrayExpression" ) !== -1 && node.type === "ArrayExpression" &&
        node.hasOwnProperty( "elements" ) && !node.elements.length ) {
        this.sniff( node.range[ 1 ] - node.range[ 0 ] - 2, node.range, node.loc );
      }
      if ( rule[ "for" ].indexOf( "CallExpression" ) !== -1 && node.type === "CallExpression" &&
        node.hasOwnProperty( "arguments" ) && !node[ "arguments" ].length && node.callee ) {
        this.sniff( node.range[ 1 ] - node.range[ 0 ] - 2 - node.callee.name.length, node.range, node.loc );
      }
      // where 2 stats for [] or {}
    },
    /**
     *
     * @param {number} actual
     * @param {number} expected
     * @param {object} range
     * @param {object} loc
     */
    sniff: function( actual, range, loc ) {
      var code = "EmptyConstructsSpacing";
      if ( actual !== 0 ) {
        mediator.publish( "violation", NAME, code, range, loc, {
          actual: actual,
          expected: 0
        });
      }
    }
  };
};
  return SniffClass;
});