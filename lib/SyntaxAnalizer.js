/*
	* @package jscodesniffer
	* @author sheiko
	* @license MIT
	* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
	* jscs standard:Jquery
	* jshint unused:false
	* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
	*/
// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	/**
	* Override AMD `define` function for RequireJS
	* @param {function( function, Object, Object )} factory
	*/
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* A module representing a SyntaxAnalizer.
	* @module lib/SyntaxAnalizer
	* @param {function( string )} require
	*/
define(function( require ) {
	"use strict";

	/**
		* Syntax analyze methods
		* @type {string[]}
		*/
	var sniffTypes = [
			"sourceCode",
			"syntaxTree",
			"token"
		],
		/**
		* Replica of PHP ucfirst
		* @access private
		* @param {string} str
		* @returns {string}
		*/
		ucfirst = function( str ) {
			return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
		},
		/**
		* Available sniffs names
		* @namespace
		*/
		registeredSniffs = {
			/** @type {string[]} */
			sourceCode: [
				"Indentation",
				"LineLength",
				"LineSpacing"
			],
			/** @type {string[]} */
			token: [
				"CommaPunctuatorSpacing",
				"QuoteConventions",
				"SemicolonPunctuatorSpacing"
			],
			/** @type {string[]} */
			syntaxTree: [
				"ArgumentsSpacing",
				"ArrayLiteralSpacing",
				"ChainedMethodCallsSpacing",
				"ChainedMethodCallsPerLineConventions",
				"CompoundStatementConventions",
				"EmptyConstructsSpacing",
				"FunctionNamingConventions",
				"NewExpressionCalleeNamingConventions",
				"ObjectLiteralSpacing",
				"OperatorSpacing",
				"ParametersSpacing",
				"TernaryConditionalPunctuatorsSpacing",
				"UnaryExpressionIdentifierSpacing",
				"VariableDeclarationPerScopeConventions",
				"VariableNamingConventions",
				"ObjectLiteralConventions",
				"ArrayLiteralConventions",
				"FunctionDeclarationParameterListSpacing",
				"FunctionExpressionParameterListSpacing",
				"CallExpressionArgumentListSpacing"
			]
		};

		/**
		* Workaround for http://requirejs.org/docs/errors.html#notloaded
		*/
		if ( typeof requirejs === "function" ) {
			require( "./Sniff/SourceCode/Indentation.js" );
			require( "./Sniff/SourceCode/LineLength.js" );
			require( "./Sniff/SourceCode/LineSpacing.js" );
			require( "./Sniff/SyntaxTree/ArgumentsSpacing.js" );
			require( "./Sniff/SyntaxTree/ArrayLiteralSpacing.js" );
			require( "./Sniff/SyntaxTree/ChainedMethodCallsSpacing.js" );
			require( "./Sniff/SyntaxTree/ChainedMethodCallsPerLineConventions.js" );
			require( "./Sniff/SyntaxTree/CompoundStatementConventions.js" );
			require( "./Sniff/SyntaxTree/EmptyConstructsSpacing.js" );
			require( "./Sniff/SyntaxTree/FunctionNamingConventions.js" );
			require( "./Sniff/SyntaxTree/NewExpressionCalleeNamingConventions.js" );
			require( "./Sniff/SyntaxTree/ObjectLiteralSpacing.js" );
			require( "./Sniff/SyntaxTree/OperatorSpacing.js" );
			require( "./Sniff/SyntaxTree/ParametersSpacing.js" );
			require( "./Sniff/SyntaxTree/TernaryConditionalPunctuatorsSpacing.js" );
			require( "./Sniff/SyntaxTree/UnaryExpressionIdentifierSpacing.js" );
			require( "./Sniff/SyntaxTree/VariableDeclarationPerScopeConventions.js" );
			require( "./Sniff/SyntaxTree/VariableNamingConventions.js" );
			require( "./Sniff/SyntaxTree/ObjectLiteralConventions.js" );
			require( "./Sniff/SyntaxTree/ArrayLiteralConventions.js" );
			require( "./Sniff/SyntaxTree/FunctionDeclarationParameterListSpacing.js" );
			require( "./Sniff/SyntaxTree/FunctionExpressionParameterListSpacing.js" );
			require( "./Sniff/SyntaxTree/CallExpressionArgumentListSpacing.js" );
			require( "./Sniff/Token/CommaPunctuatorSpacing.js" );
			require( "./Sniff/Token/QuoteConventions.js" );
			require( "./Sniff/Token/SemicolonPunctuatorSpacing.js" );
		}
	/**
		* Provides methods to analyze a given syntax (tree, tokens, code) with sniffs associated to a
		* given rules (standard)
		*
		* @constructor
		* @alias module:lib/SyntaxAnalizer
		* @param {Object} standard
		*/
	return function( standard ) {
		var sniffs = {
			sourceCode: {},
			syntaxTree: {},
			token: {}
		};
		/** @lends module:lib/SyntaxAnalizer.prototype */
		return {
		/**
			* Populate sniffs repository with instances
			* @access public
			* @param {Object} sourceCode
			* @param {Object} mediator
			* @param {module:lib/TokenIterator} tokenIterator
			*/
		loadSniffs: function( sourceCode, mediator, tokenIterator ) {
			sniffTypes.forEach(function( type ){
				registeredSniffs[ type ].forEach(function( name ){
					var Proto = require( "./Sniff/" + ucfirst( type ) + "/" + name + ".js" );
					sniffs[ type ][ name ] = new Proto( sourceCode, mediator, tokenIterator );
				});
			});
		},
		/**
			* Validate assigned rules (of the given standard)
			* @access public
			*/
		validateStandard: function() {
			var rule,
				/**
				*
				* @param {type} type
				* @returns {undefined}@callback validate
				* @param {string} type
				*/
				validate = function( type ) {
					if ( sniffs[ type ].hasOwnProperty( this.rule ) && standard[ this.rule ] ) {
						sniffs[ type ][ this.rule ].validateRule( standard[ this.rule ] );
					}
				};
			for( rule in standard ) {
				if ( standard.hasOwnProperty( rule ) ) {
					sniffTypes.forEach( validate, { rule: rule });
				}
			}
		},

		/**
			* Analyze the source code for the registered rules and available sniffs
			* @access public
			*/
		applySourceCodeSniffs: function() {
			var rule;
			for( rule in standard ) {
				if ( standard.hasOwnProperty( rule ) && sniffs.sourceCode.hasOwnProperty( rule ) &&
					standard[ rule ] ) {
					sniffs.sourceCode[ rule ].run( standard[ rule ] );
				}
			}
		},
		/**
			* Go through the tokens list and apply registered sniffs to every token
			* @access public
			* @param {Object[]} tokens
			*/
		applyTokenSniffs: function( tokens ) {
			/**
			* @callback anonymous
			* @param {string} token
			*/
			tokens.forEach(function( token ){
			var rule;
			for( rule in standard ) {
				if ( standard.hasOwnProperty( rule ) && sniffs.token.hasOwnProperty( rule ) &&
					standard[ rule ] ) {
					sniffs.token[ rule ].run( standard[ rule ], token );
				}
			}
			});
		},
		/**
			* Go through the syntax tree and apply registered sniffs to every node
			* @access public
			* @param {Object} syntaxTree
			*/
		applySyntaxTreeSniffs: function( syntaxTree ) {
			/**
			* @callback sniffSyntaxTree
			* @param {Object} node
			* @param {Object} [pNode={ type: null }]
			*/
			this.traverseSyntaxTree( syntaxTree, function( node, pNode ){
				var rule;
				for( rule in standard ) {
					if ( standard.hasOwnProperty( rule ) && sniffs.syntaxTree.hasOwnProperty( rule ) &&
						standard[ rule ] ) {
						sniffs.syntaxTree[ rule ].run( standard[ rule ], node, pNode || { type: null } );
					}
				}
			});
		},
		/**
		* Flag all the statements inside an outter call expression
		* @access protected
		* @param {Object} syntaxTree
		*/
		markNestings: function( syntaxTree ){
			/**
			* Implementing callback
			* @param {Object} node
			*/
			var that = this,
				cb = function( node ) {
					if ( node.type === "CallExpression" ) {
						node[ "arguments" ].forEach(function( arg ){
							that.traverseSyntaxTree( arg, function( el ){
								el.isNesting = true;
							}, node );
						});
					}
				};
			this.traverseSyntaxTree( syntaxTree, cb );
		},

		/**
		* Esprima syntax tree traverser
		* Inspiread by
		* https://github.com/mdevils/node-jscs
		* @access public
		* @param {Object} node
		* @param {sniffSyntaxTree} fn
		* @param {Object} parentNode
		*/
		traverseSyntaxTree: function( node, fn, parentNode ) {
			var that = this,
				propName,
				contents,
				/**
				* @callback traverseEvery
				* @param {Object} member
				*/
				traverseEvery = function( member ) {
					that.traverseSyntaxTree( member, this.fn, this.node );
				};

			if ( node && node.hasOwnProperty( "type" ) ) {
				fn( node, parentNode );
			}

			for ( propName in node ) {
				if ( propName !== "parent" && node.hasOwnProperty( propName ) &&
					propName !== "tokens" && propName !== "comments" ) {
					contents = node[ propName ];
					if ( contents && typeof contents === "object" ) {
						if ( Array.isArray( contents ) ) {
							contents.forEach( traverseEvery, { fn: fn, node: node });
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

