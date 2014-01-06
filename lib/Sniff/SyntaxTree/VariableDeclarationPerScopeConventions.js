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
define( function ( require, exports, module ) {
"use strict";

var utils = require( "../Utils"),
    NAME = "VariableDeclarationPerScopeConventions",
    compoundStatements = [
      "IfStatement",
      "WhileStatement",
      "DoWhileStatement",
      "ForStatement",
      "ForInStatement",
      "WithStatement",
      "TryStatement"
    ],
    Sniff = function( sourceCode, mediator ) {
      var matches = 0;
      return {
        /**
          * Check contract
          * @param {object} rule
          */
          validateRule: function( rule ) {
          utils.validateRule( rule, "disallowMultiplePerBlockScope", "boolean" );
          //utils.validateRule( rule, "disallowMultiplePerCompoundStatement", "boolean" );
          },
        /**
          * Run the sniffer according a given rule if a given node type matches the case
          * @param {object} rule
          * @param {object} node
          */
        run: function( rule, node ) {
          matches = 0;
          if ( !rule.disallowMultiplePerBlockScope ) {
            return;
          }
          if ( node.type !== "FunctionExpression" && node.type !== "FunctionDeclaration" ) {
              return;
          }
          if ( !node.body || !node.body.type || node.body.type !== "BlockStatement" || !node.body.body ) {
              return;
          }
          this.sniffPerScope( rule, node );

        },
        /**
          * Sniff scope recursively
          * @param {object} rule
          * @param {object} node
          */
        sniffPerScope: function( rule, node ) {
          var that = this,
              scope;

          scope = node.body || node.consequent.body || node.block.body;

          scope && scope.body.forEach( function( el ){
            if ( el.type  === "VariableDeclaration" ) {
              matches++;
              if ( matches > 1 ) {
                that.sniff( el, matches, 1, "MultipleVarDeclarationPerBlockScope" );
              }
            }
            // Go deeper if a compound statement. That's is still the same scope
            if ( compoundStatements.indexOf( el.type )  !== -1 ) {
              that.sniffPerScope( rule, el );
            }
          });
        },


        /**
        * Sniff a given range
        *
        * @param {object} node
        * @param {number} actual
        * @param {number} expected
        * @param {string} errorCode
        */
        sniff: function( node, actual, expected, errorCode ) {
            mediator.publish( "violation", NAME, errorCode, node.range, node.loc, {
              actual: actual,
              expected: expected
            });
        }

      };
    };
  return Sniff;
});