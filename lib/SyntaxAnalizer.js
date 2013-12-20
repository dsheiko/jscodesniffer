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

    /**
     * Syntax analyze methods
     * @type {array}
     */
  var sniffTypes = [
        "SourceCode",
        "SyntaxTree",
        "Token"
      ],
      /**
       * Available sniffs names
       * @type {object}
       */
      registeredSniffs = {
        SourceCode: [
          "Indentation",
          "LineLength",
          "LineSpacing"
        ],
        Token: [
          "CommaPunctuatorSpacing",
          "QuoteConventions",
          "SemicolonPunctuatorSpacing"
        ],
        SyntaxTree: [
          "ArgumentsSpacing",
          "ArrayLiteralSpacing",
          "ChainedMethodCallsSpacing",
          "CompoundStatementConventions",
          "EmptyConstructsSpacing",
          "FunctionNamingConventions",
          "ObjectLiteralSpacing",
          "OperatorSpacing",
          "ParametersSpacing",
          "TernaryConditionalPunctuatorsSpacing",
          "UnaryExpressionIdentifierSpacing",
          "VariableDeclarationPerScopeConventions",
          "VariableNamingConventions"
        ]
      };
    /**
     * Provides methods to analyze a given syntax (tree, tokens, code) with sniffs associated to a
     * given rules (standard)
     *
     * @class
     * @param {object} standard
     */
    return function( standard ) {
      var sniffs = {
        SourceCode: {},
        SyntaxTree: {},
        Token: {}
      };

      return {
        /**
         * Populate sniffs repository with instances
         * @param {object} sourceCode
         * @param {object} mediator
         */
        loadSniffs: function( sourceCode, mediator ) {
          sniffTypes.forEach( function( type ){
            registeredSniffs[ type ].forEach( function( name ){
              var Proto = require( "./Sniff/" + type + "/" + name + ".js" );
              sniffs[ type ][ name ] = new Proto( sourceCode, mediator );
            });
          });
        },
        /**
         * Validate assigned rules (of the given standard)
         */
        validateStandard: function() {
          var rule,
              validate = function( type ) {
                if ( sniffs[ type ].hasOwnProperty( this.rule ) && standard[ this.rule ] ) {
                  sniffs[ type ][ this.rule ].validateRule( standard[ this.rule ] );
                }
              };
          for( rule in standard ) {
            if ( standard.hasOwnProperty( rule ) ) {
              sniffTypes.forEach( validate, { rule: rule } );
            }
          }
        },

        /**
         * Analyze the source code for the registered rules and available sniffs
         */
        applySourceCodeSniffs: function() {
          var rule;
          for( rule in standard ) {
            if ( standard.hasOwnProperty( rule ) && sniffs.SourceCode.hasOwnProperty( rule ) &&
              standard[ rule ] ) {
              sniffs.SourceCode[ rule ].run( standard[ rule ] );
            }
          }
        },
        /**
         * Go through the tokens list and apply registered sniffs to every token
         * @param {Array} tokens
         */
        applyTokenSniffs: function( tokens ) {
          tokens.forEach(function( token ){
            var rule;
            for( rule in standard ) {
              if ( standard.hasOwnProperty( rule ) && sniffs.Token.hasOwnProperty( rule ) &&
                standard[ rule ] ) {
                sniffs.Token[ rule ].run( standard[ rule ], token );
              }
            }
          });
        },
        /**
         * Go through the syntax tree and apply registered sniffs to every node
         * @param {object} syntaxTree
         */
        applySyntaxTreeSniffs: function( syntaxTree ) {
          this.traverseSyntaxTree( syntaxTree, function( node, pNode ){
            var rule;
            for( rule in standard ) {
              if ( standard.hasOwnProperty( rule ) && sniffs.SyntaxTree.hasOwnProperty( rule ) && standard[ rule ] ) {
                sniffs.SyntaxTree[ rule ].run( standard[ rule ], node, pNode || { type: null });
              }
            }
          });
        },

        /**
         * Esprima syntax tree traverser
         * Inspiread by
         * https://github.com/mdevils/node-jscs
         * @param {object} node
         * @param {function} fn
         * @param {object} parentNode
         */
        traverseSyntaxTree: function( node, fn, parentNode ) {
          var that = this,
              propName,
              contents,
              traverseEvery = function( member ) {
                this.that.traverseSyntaxTree( member, this.fn, this.node );
              };
              
          node && node.hasOwnProperty( "type" ) && fn( node, parentNode );

          for ( propName in node ) {
            if ( propName !== "parent" && node.hasOwnProperty( propName ) &&
              propName !== "tokens" && propName !== "comments" ) {
              contents = node[ propName ];
              if ( contents && typeof contents === 'object' ) {
                if ( Array.isArray( contents ) ) {
                  contents.forEach( traverseEvery, { fn: fn, node: node, that: that } );
                } else {
                  that.traverseSyntaxTree( contents, fn, node );
                }
              }
            }
          }
        }


      };
    };
});

