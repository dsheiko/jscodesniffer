/*
* @package jscodesniffer
* @author sheiko
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* jscs standard:Jquery
* jshint unused:false
* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
*/
/**
* A module representing a sniffer.
* @module lib/Sniff/SyntaxTree/CompoundStatementConventions
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
	* @param {function( string )} require
	*/
define(function ( require ) {
		/**
		* @type {utilsSniff/Utils}
		*/
var utils = require( "../Utils" ),
		/**
		* @constant
		* @type {String}
		* @default
		*/
		NAME = "CompoundStatementConventions",
	/**
	* @constructor
	* @alias module:lib/Sniff/SyntaxTree/CompoundStatementConventions
	* @alias module:lib/Sniff/SyntaxTree/ArrayLiteralSpacing
	* @param {module:lib/SourceCode} sourceCode
	* @param {module:lib/Mediator} mediator
	*/
	Sniff = function( sourceCode, mediator ) {
		/** @lends module:lib/Sniff/SyntaxTree/CompoundStatementConventions.prototype */
		return {
			/**
			* Check the contract
			* @access public
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "for", "array" );
				utils.validateRule( rule, "requireBraces", "boolean" );
				utils.validateRule( rule, "requireMultipleLines", "boolean" );
			},
			/**
			* Run the sniffer according a given rule if a given node type matches the case
			* @access public
			* @param {Object} rule
			* @param {Object} node
			*/
			run: function( rule, node ) {

				if ( rule[ "for" ].indexOf( node.type ) !== -1 ) {
					// Conditional statements e.g. IfStatement
          // if(test) { exp; }
          // node.test - `test`
          // node.consequent = `{ exp; }`
          // node.consequent.body[ 0 ] - `exp;`
					if ( node.consequent ) {

            rule.hasOwnProperty( "allowOpeningBracePrecedingWhitespaces" ) &&
              this.sniffAllowOpeningBracePrecedingWhitespaces( node.test, node.consequent,
                rule.allowOpeningBracePrecedingWhitespaces );

            rule.hasOwnProperty( "requireOpeningBracePrecedingNewLine" ) &&
              rule.requireOpeningBracePrecedingNewLine &&
              this.sniffRequireOpeningBracePrecedingNewLine( node.test, node.consequent );

            rule.hasOwnProperty( "allowOpeningBraceTrailingWhitespaces" ) &&
              this.sniffAllowOpeningBraceTrailingWhitespaces( node.consequent,
                rule.allowOpeningBraceTrailingWhitespaces );

            rule.hasOwnProperty( "requireOpeningBraceTrailingNewLine" ) &&
              rule.requireOpeningBraceTrailingNewLine &&
              this.sniffRequireOpeningBraceTrailingNewLine( node.consequent );

            rule.hasOwnProperty( "allowClosingBracePrecedingWhitespaces" ) &&
              this.sniffAllowClosingBracePrecedingWhitespaces( node.consequent,
                rule.allowClosingBracePrecedingWhitespaces );

            rule.hasOwnProperty( "requireClosingBracePrecedingNewLine" ) &&
              rule.requireClosingBracePrecedingNewLine &&
              this.sniffRequireClosingBracePrecedingNewLine( node.consequent );

						this.sniffRequireBraces( node.consequent, rule.requireBraces );
						this.sniffRequireMultipleLines( node.consequent, rule.requireMultipleLines );
					}
					// Iterating statements e.g. ForStatement
          // for( init; test; update ) body
					if ( node.body ) {
						this.sniffRequireBraces( node.body, rule.requireBraces );
						this.sniffRequireMultipleLines( node.body, rule.requireMultipleLines );
					}
					// Special cases e.g. TryStatement
          // try {..} catch
          // parent[0], block[0].., handlers
					if ( node.block ) {
						this.sniffRequireBraces( node.block, rule.requireBraces );
						this.sniffRequireMultipleLines( node.block, rule.requireMultipleLines );
					}
					// SwitchStatement has no block statement reflected in syntax tree
					if ( node.type === "SwitchStatement" ) {
						this.sniffRequireMultipleLines( node, rule.requireMultipleLines );
					}
				}
			},


       /**
      * Analyze test)__{..
			* @access protected
			* @param {Object} test
      * @param {Object} consequent
			*/
			sniffRequireOpeningBracePrecedingNewLine: function( test, consequent ) {
				var excerpt = sourceCode.extract( test.range[ 1 ] + 1, consequent.range[ 0 ] );
				excerpt.match( /\n/gm ) ||
          this.logRequired( excerpt, "CompoundStatementRequireOpeningBracePrecedingNewLine",
              consequent );
			},

      /**
      * Analyze test){___..
			* @access protected
      * @param {Object} consequent
			*/
			sniffRequireOpeningBraceTrailingNewLine: function( consequent ) {
				var excerpt = sourceCode.extract( consequent.range[ 0 ] + 1, consequent.body[ 0 ].range[ 0 ] );
        excerpt.match( /\n/gm ) ||
          this.logRequired( excerpt, "CompoundStatementRequireOpeningBraceTrailingNewLine",
              consequent );
			},

      /**
      * Analyze test){..___}
			* @access protected
      * @param {Object} consequent
			*/
			sniffRequireClosingBracePrecedingNewLine: function( consequent ) {
				var excerpt = sourceCode.extract( consequent.body[ consequent.body.length - 1 ].range[ 1 ],
            consequent.range[ 1 ] - 1 );
        excerpt.match( /\n/gm ) ||
          this.logRequired( excerpt, "CompoundStatementRequireClosingBracePrecedingNewLine",
              consequent );
			},



      /**
       *
       * @param {Object} excerpt
       * @param {String} code
       * @param {Object} node
       */
      logRequired: function( excerpt, code, node) {
        mediator.publish( "violation", NAME, code, node.range, node.loc, {
          excerpt: excerpt.get(),
          trace: ".." + excerpt.get() + "..",
          where: ""
        });
      },

      /**
       *
       * @param {Object} excerpt
       * @param {String} code
       * @param {Object} node
       * @param {Number} expected
       * @param {Number} actual
       */
      logAllowed: function( excerpt, code, node, expected, actual ) {
        mediator.publish( "violation", NAME, code, node.range, node.loc, {
          excerpt: excerpt.get(),
          trace: ".." + excerpt.get() + "..",
          where: "",
          expected: expected,
          actual: actual
        });
      },

      /**
      * Analyze test)__{..
			* @access protected
			* @param {Object} test
      * @param {Object} consequent
			* @param {Number} expected
			*/
			sniffAllowOpeningBracePrecedingWhitespaces: function( test, consequent, expected ) {
				var excerpt = sourceCode.extract( test.range[ 1 ] + 1, consequent.range[ 0 ] );
				excerpt.length() !== expected &&
          this.logAllowed( excerpt, "CompoundStatementAllowOpeningBracePrecedingWhitespaces",
              consequent, expected, excerpt.length() );
			},

      /**
      * Analyze test){___..
			* @access protected
      * @param {Object} consequent
			* @param {Number} expected
			*/
			sniffAllowOpeningBraceTrailingWhitespaces: function( consequent, expected ) {
				var excerpt = sourceCode.extract( consequent.range[ 0 ] + 1, consequent.body[ 0 ].range[ 0 ] );
        excerpt.length() !== expected &&
          this.logAllowed( excerpt, "CompoundStatementAllowOpeningBraceTrailingWhitespaces",
              consequent, expected, excerpt.length() );
			},

      /**
      * Analyze test){..___}
			* @access protected
      * @param {Object} consequent
			* @param {Number} expected
			*/
			sniffAllowClosingBracePrecedingWhitespaces: function( consequent, expected ) {
				var excerpt = sourceCode.extract( consequent.body[ consequent.body.length - 1 ].range[ 1 ],
            consequent.range[ 1 ] - 1 );
        excerpt.length() !== expected &&
          this.logAllowed( excerpt, "CompoundStatementAllowClosingBracePrecedingWhitespaces",
              consequent, expected, excerpt.length() );
			},

			/**
				* @access protected
				* @param {Object} node
				* @param {boolean} isRequired
				*/
			sniffRequireBraces: function( node, isRequired ) {
				var code = "CompoundStatementRequireBraces",
						excerpt = sourceCode.extract( node[ 0 ], node[ 1 ] );
				if ( isRequired && node.type !== "BlockStatement" ) {
					mediator.publish( "violation", NAME, code, node.range, node.loc,
					{
						excerpt: excerpt.get(),
						trace: ".." + excerpt.get() + "..",
						where: ""
					});
				}
			},
			/**
				* @access protected
				* @param {Object} node
				* @param {boolean} isRequired
				*/
			sniffRequireMultipleLines: function( node, isRequired ) {
				var code = "CompoundStatementRequireMultipleLines",
						excerpt = sourceCode.extract( node.range[ 0 ], node.range[ 1 ] ),
            nl = excerpt.match( /\n/gm );
				// if (dumb) { dumb = 1;\n} still invalid must have at least 2 EOLs
				if ( isRequired && ( !nl || nl.length < 2 ) ) {
					mediator.publish( "violation", NAME, code, node.range, node.loc,
					{
						excerpt: excerpt.get(),
						trace: ".." + excerpt.get() + "..",
						where: ""
					});
				}
			}
		};
	};
	return Sniff;
});