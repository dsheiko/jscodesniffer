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
define(function ( require, exports, module ) {

var utils = require( "../Utils"),
    NAME = "TernaryConditionalPunctuatorsSpacing",
    SniffClass = function( sourceCode, mediator ) {
  return {
    /**
      * Check contract
      * @param {object} rule
      */
      validateRule: function( rule ) {
      utils.validateRule( rule, "allowTestTrailingWhitespaces", "number" );
      utils.validateRule( rule, "allowConsequentPrecedingWhitespaces", "number" );
      utils.validateRule( rule, "allowConsequentTrailingWhitespaces", "number" );
      utils.validateRule( rule, "allowAlternatePrecedingWhitespaces", "number" );
      },
    /**
      * Run the sniffer according a given rule if a given node type matches the case
      * @param {object} rule
      * @param {object} node
      */
    run: function( rule, node ) {
      var context,
          qMarkPos,
          sMarkPos;

      if ( node.type === "ConditionalExpression" && node.test && node.consequent && node.alternate ) {

        context = sourceCode.extract( node.range[ 0 ], node.range[ 1 ] );
        qMarkPos = node.range[ 0 ] + context.find( "?" );
        sMarkPos = node.range[ 0 ] + context.find( ":" );

        // test< >? consequent : alternate
        this.sniff( node.test, node.test.range[ 1 ],
          qMarkPos, rule.allowTestTrailingWhitespaces, "TernaryConditionalTestTrailingWhitespaces" );

        // test ?< >consequent : alternate
        this.sniff( node.consequent, qMarkPos + 1,
          node.consequent.range[ 0 ], rule.allowConsequentPrecedingWhitespaces, "TernaryConditionalConsequentPrecedingWhitespaces" );

        // test ? consequent< >: alternate
        this.sniff( node.consequent, node.consequent.range[ 1 ],
          sMarkPos, rule.allowConsequentTrailingWhitespaces, "TernaryConditionalConsequentTrailingWhitespaces" );

        // test ? consequent :< >alternate
        this.sniff( node.alternate, sMarkPos + 1,
          node.alternate.range[ 0 ], rule.allowAlternatePrecedingWhitespaces, "TernaryConditionalAlternatePrecedingWhitespaces" );

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
  return SniffClass;
});