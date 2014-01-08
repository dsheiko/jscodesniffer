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
define(function ( require ) {

var utils = require( "../Utils"),
    NAME = "VariableNamingConventions";
return function( sourceCode, mediator ) {
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

          // Ignore reserved like window.XMLHttpRequest
          if ( parentNode.type && parentNode.type === "MemberExpression" ) {
            return;
          }
          // Ignore case: foo = function(){};
          if ( parentNode.type && parentNode.type === "AssignmentExpression" && parentNode.right &&
              parentNode.right.type === "FunctionExpression" ) {
            return;
          }

          // Ignore case: return Cli;
          if ( parentNode.type && parentNode.type === "ReturnStatement" ) {
            return;
          }

          // Ignore case: function foo() {}
          if ( parentNode.type && parentNode.type === "FunctionDeclaration" ) {
            return;
          }
          // Ignore case: var logger = new Logger();
          if ( parentNode.type && parentNode.type === "NewExpression" ) {
            return;
          }
          if ( parentNode.type && parentNode.type === "VariableDeclarator" && parentNode.init &&
              // Ignore case: var SourceCode = function(){};
              ( parentNode.init.type === "FunctionExpression" ||
              // Ignore case: var SourceCode = require( "./SourceCode" )
                parentNode.init.type === "CallExpression" ) ) {
            return;
          }
          if ( node.type === "Identifier" && !this.isConstant( node.name ) ) {
            this.sniffCase( rule.allowCase, node );
            this.sniffRepeatingUc( rule.allowRepeating, node );
            this.sniffNumbers( rule.allowNumbers, node );
          }
        },
        /**
         * @param {string} text
         */
        isConstant: function( text ) {
          var reAllUpperCase = /^[\$_]?[A-Z0-9_]*$/g;
          return reAllUpperCase.test( text );
        },
        /**
          *
          * @param {Array} rule
          * @param {object} node
          */
        sniffCase: function( rule, node ) {
          var reCase = {
                camel: /^[\$_]*[a-z][a-zA-Z0-9]*$/g,
                pascal: /^[\$_]*[A-Z][a-zA-Z0-9]*$/g
              },
              reAllLowerCase = /^[a-z]+$/g,
              isChainValid = false,
              val;
          if ( node.type === "Identifier"  ) {
            val = node.name;
            if ( reAllLowerCase.test( val ) ) {
              return;
            }

            rule.forEach(function( nCase ){
              var isValid;
              if ( reCase.hasOwnProperty( nCase ) ) {
                isValid = reCase[ nCase ].test( val );
                isChainValid = isChainValid || isValid;
              }
            });
            if ( !isChainValid ) {
              mediator.publish( "violation", NAME, "VariableNamingConventions", node.range, node.loc, {
                actual: val,
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
          var reAllLowerCase = /^[a-z]+$/g,
              reRepeatingUc = /[A-Z]+/g,
              val;
          if ( node.type === "Identifier"  ) {
            val = node.name;
            if ( reAllLowerCase.test( val ) ) {
              return;
            }
            if ( !rule && reRepeatingUc.test( val ) ) {
              mediator.publish( "violation", NAME, "VariableNamingRepeatingUppercase", node.range, node.loc, {
                actual: val,
                expected: ""
              });
            }
          }
        },

          /**
          *
          * @param {object} rule
          * @param {object} node
          */
        sniffNumbers: function( rule, node ) {
          var reNumbers = /[0-9]/g,
              val;
          if ( node.type === "Identifier"  ) {
            val = node.name;
            if ( !rule && reNumbers.test( val ) ) {
              mediator.publish( "violation", NAME, "VariableNamingNumbersNotAllowed", node.range, node.loc, {
                actual: val,
                expected: ""
              });
            }
          }
        }

      };
    };
});