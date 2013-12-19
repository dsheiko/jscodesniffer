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
    NAME = "VariableNamingConventions";
return function( sourceCode, mediator ) {

      var reCase = {
            camel: /^[\$_]?[a-z][a-zA-Z0-9]*$/g,
            pascal: /^[\$_]?[A-Z][a-zA-Z0-9]*$/g
          },
          reRepeatingUc = /[A-Z]+/g,
          reNumbers = /[0-9]/g;

      return {
        /**
         * Check contract
         * @param {object} rule
         */
         validateRule: function( rule ) {
            utils.validateRule( rule, "allowCase", "array", true );
            utils.validateRule( rule, "allowRepeating", "boolean", true );
            utils.validateRule( rule, "allowNumbers", "boolean", true );
         },
        /**
         * Run the sniffer according a given rule if a given node type matches the case
         * @param {object} rules
         * @param {object} node
         */
        run: function( rule, node, parentNode ) {

          // ignore reserved like window.XMLHttpRequest
          if ( parentNode.type && parentNode.type === "MemberExpression" ) {
            return;
          }
          if ( parentNode.type && parentNode.type === "AssignmentExpression" && parentNode.right &&
              parentNode.right.type === "FunctionExpression" ) {
            return;
          }
          if ( parentNode.type && parentNode.type === "FunctionDeclaration" ) {
            return;
          }
          if ( parentNode.type && parentNode.type === "VariableDeclarator" && parentNode.init &&
              parentNode.init.type === "FunctionExpression" ) {
            return;
          }
          if ( node.type === "Identifier" ) {
            this.sniffCase( rule.allowCase, node );
            this.sniffRepeatingUc( rule.allowRepeating, node );
            this.sniffNumbers( rule.allowNumbers, node );
          }
        },

        /**
         *
         * @param {array} rule
         * @param {object} node
         */
        sniffCase: function( rule, node ) {
          var code = "VariableNamingConventions",
              isValid = false;
          if ( node.type === "Identifier"  ) {
            rule.forEach(function( nCase ){
              if ( reCase.hasOwnProperty( nCase ) ) {
                isValid = isValid || reCase[ nCase ].test( node.name );
              }
            });
            if ( !isValid ) {
              mediator.publish( "violation", NAME, code, node.range, node.loc, {
                actual: "",
                expected: rule.join( " or " )
              });
            }
          }
        },
        /**
         *
         * @param {object} rule
         * @param {object} node
         */
        sniffRepeatingUc: function( rule, node ) {
          var code = "VariableNamingRepeatingUppercase";
          if ( node.type === "Identifier"  ) {
            if ( !rule && reRepeatingUc.test( node.name ) ) {
              mediator.publish( "violation", NAME, code, node.range, node.loc );
            }
          }
        },

         /**
         *
         * @param {object} rule
         * @param {object} node
         */
        sniffNumbers: function( rule, node ) {
          var code = "VariableNamingNumbersNotAllowed";
          if ( node.type === "Identifier"  ) {
            if ( !rule && reNumbers.test( node.name ) ) {
              mediator.publish( "violation", NAME, code, node.range, node.loc );
            }
          }
        }

      };
    };
});