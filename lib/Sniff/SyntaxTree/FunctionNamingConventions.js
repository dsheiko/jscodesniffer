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

var utils = require( "../Utils" ),
    NAME = "FunctionNamingConventions";

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
          * @param {object} rule
          * @param {object} node
          */
        run: function( rule, node ) {

          if ( node.type === "AssignmentExpression" && node.right &&
              node.right.type === "FunctionExpression" ) {
            this.sniffCase( rule.allowCase, node.left );
            this.sniffRepeatingUc( rule.allowRepeating, node.left );
            this.sniffNumbers( rule.allowNumbers, node.left );
          }
          if ( node.type === "FunctionDeclaration" ) {
            this.sniffCase( rule.allowCase, node.id );
            this.sniffRepeatingUc( rule.allowRepeating, node.id );
            this.sniffNumbers( rule.allowNumbers, node.id );
          }
          if ( node.type === "VariableDeclarator" && node.init &&
              node.init.type === "FunctionExpression" ) {
            this.sniffCase( rule.allowCase, node.id, node.id );
            this.sniffRepeatingUc( rule.allowRepeating, node.id );
            this.sniffNumbers( rule.allowNumbers, node.id );
          }

        },
        /**
          *
          * @param {Array} rule
          * @param {object} node
          */
        sniffCase: function( rule, node ) {
          var code = "FunctionNamingConventions",
              isValid = false,
              reCase = {
                camel: /^[\$_]*[a-z][a-zA-Z0-9]*$/g,
                pascal: /^[\$_]*[A-Z][a-zA-Z0-9]*$/g
              };

          if ( node.type === "Identifier"  ) {
            rule.forEach(function( nCase ){
              if ( reCase.hasOwnProperty( nCase ) ) {
                isValid = isValid || reCase[ nCase ].test( node.name );
              }
            });
            if ( !isValid ) {
              mediator.publish( "violation", NAME, code, node.range, node.loc, {
                actual: node.name,
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
          var code = "FunctionNamingRepeatingUppercase",
              reRepeatingUc = /[A-Z]+/g;
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
          var code = "FunctionNamingNumbersNotAllowed",
              reNumbers = /[0-9]/g;
          if ( node.type === "Identifier"  ) {
            if ( !rule && reNumbers.test( node.name ) ) {
              mediator.publish( "violation", NAME, code, node.range, node.loc );
            }
          }
        }

      };
    };
});