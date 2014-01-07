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
    NAME = "ChainedMethodCallsSpacing",
    Sniff = function( sourceCode, mediator ) {
      var members = [];
      return {
          /**
          * Check contract
          * @param {object} rule
          */
          validateRule: function( rule ) {
          utils.validateRule( rule, "allowTrailingObjectWhitespaces", "number" );
          utils.validateRule( rule, "allowPrecedingPropertyWhitespaces", "number" );
          utils.validateRule( rule, "allowOnePerLineWhenMultilineCaller", "boolean" );
        },
        /**
         * Extract all the members of a chained call
         * @param {object} node (MemberExpression)
         */
        findMembers: function( node ) {

          if ( node.object && node.object.type === "CallExpression" && node.object.callee ) {
            this.findMembers( node.object.callee );
          }

          if ( node.property ) {
            members.push( node.property );
          }

          if ( node.object && node.object.type === "Identifier" ) {
            members.push( node.object );
          }
        },
        /**
          * Run the sniffer according a given rule if a given node type matches the case
          * @param {object} rule
          * @param {object} node
          * @param {object} pNode
          */
        run: function( rule, node, pNode ) {
          var pos;


          if ( rule.allowOnePerLineWhenMultilineCaller && pNode.type === "ExpressionStatement" &&
            node.type === "CallExpression" && node.callee &&
            node.callee.type === "MemberExpression" && node.callee.computed === false  ) {
            // Multiline
            if ( sourceCode.extract( node.range[ 0 ], node.range[ 1 ] ).find( "\n" ) !== -1 ) {
              members = [];
              if ( node.callee && node.callee.type === "MemberExpression" ) {
                this.findMembers( node.callee );
              }

              members.forEach(function( member ) {
                var sameLineMem = members.filter(function( m ){
                  return m.loc.start.line === member.loc.start.line;
                });
                if ( sameLineMem.length > 1 ) {
                  mediator.publish( "violation", NAME, "ChainedMethodCallsOnePerLine", member.range, member.loc, {});
                }
              });
            }
          }

          if ( node.type === "MemberExpression" && node.object && node.property && node.computed === false ) {

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