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
define( function ( require, exports, module ) {

var utils = require( "../Utils"),
    NAME = "ObjectLiteralSpacing",
    Sniff = function( sourceCode, mediator ) {

      return {
        /**
         * Check contract
         * @param {object} rule
         */
         validateRule: function( rule ) {
          utils.validateRule( rule, "allowKeyPrecedingWhitespaces", "number", true );
          utils.validateRule( rule, "allowKeyTrailingWhitespaces", "number", true );
          utils.validateRule( rule, "allowValuePrecedingWhitespaces", "number", true );
          utils.validateRule( rule, "allowValueTrailingWhitespaces", "number", true );
         },
        /**
         * Run the sniffer according a given rule if a given node type matches the case
         * @param {object} rule
         * @param {object} node
         */
        run: function( rule, node ) {
          var that = this, last;

          if ( node.type === "ObjectExpression" ) {

            // Checking preceding for each property
            node.properties.forEach( function( prop, i ){
              // {< >key: value<, >key: value }
              var pos = i ? node.properties[ i - 1 ].value.range[ 1 ] + 1 : node.range[ 0 ] + 1;
              that.sniff( prop, pos, prop.key.range[ 0 ], rule.allowKeyPrecedingWhitespaces,
                "ObjectPropertyKeyPrecedingSpacing" );
              // { key<>: value, key<>: value }
              pos = prop.value.range[ 0 ] - 1;
              that.sniff( prop, prop.key.range[ 1 ], pos, rule.allowKeyTrailingWhitespaces,
                "ObjectPropertyKeyTrailingSpacing" );
              // { key:< >value, key:< >value }
              pos = prop.key.range[ 1 ] + 1;
              that.sniff( prop, pos, prop.value.range[ 0 ], rule.allowValuePrecedingWhitespaces,
                "ObjectPropertyValuePrecedingSpacing" );
            });
            // Checking trailing for the last property
            // { key: value, key: value< >}
            last = node.properties[ node.properties.length -1 ];
            this.sniff( last.value, last.value.range[ 1 ], node.range[ 1 ] - 1,
              rule.allowValueTrailingWhitespaces, "ObjectPropertyValueTrailingSpacing");
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
          var fragment = sourceCode.extract( lPos, rPos ).filter( "[,:]" );
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