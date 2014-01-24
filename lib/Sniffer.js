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
		},
		/**
		* Trick RequireJS that tries to resolve `require` calls with no regard to conditions
		* @param {string} module
		* @returns {*}
		*/
		load = function( module ) {
			return require( module );
		};
}
/**
	* A module representing code sniffer
	* @param {type} require
	* @returns {unresolved}iffer
	* @module Sniffer
	*/
define(function( require ) {
"use strict";

var
	/** @type {SourceCode}	*/
	SourceCode = require( "./SourceCode" ),
	/** @type {SyntaxAnalizer}	*/
	SyntaxAnalizer = require( "./SyntaxAnalizer" ),
	/** @type {Mediator}	*/
	Mediator = require( "./Mediator" ),
	/** @type {TokenIterator}	 */
	TokenIterator = require( "./TokenIterator" ),
	/** @type {utils}	 */
	utils = require( "./Utils" ),
	/** @type {Logger}	 */
	Logger = require( "./Logger" );

	/**
	* Workaround for http://requirejs.org/docs/errors.html#notloaded
	*/
	if ( typeof requirejs === "function" ) {
		require( "../standard/Jquery" );
		require( "../standard/Idiomatic" );
	}

/**
* @constructor
* @alias module:Sniffer
* @param {function} esprima - for dependency injection
*/
return function( esprima ) {
		esprima = esprima || load( "esprima" );
		return {
		/**
		* Lint source code and get results wrapped in a Logger instance
		* @access public
		* @param {string} text
		* @param {Object} options - reference
		* @param {Object} [rulesetOverrides={}]
		* @param {Object} [injectedSyntaxTree]
		* @returns {Object}
		*/
		getTestResults: function( text, options, rulesetOverrides, injectedSyntaxTree ) {
			/** @type {SyntaxAnalizer} */
			var analizer,
				/** @type {Object} */
				syntaxTree,
				/** @type {Object} */
				standard,
				/** @type {RegExp} */
				re = /\r/gm,
				/** @type {Logger} */
				logger = new Logger(),
				/** @type {SourceCode} */
				sourceCode,
				/** @type {Mediator} */
				mediator = new Mediator();

			// Normalize source code
			text = text.replace( re, "" );
			sourceCode = new SourceCode( text );

			if ( !sourceCode.length ) {
				throw new TypeError("Please pass in your source code");
			}

			rulesetOverrides = rulesetOverrides || {};


			syntaxTree = injectedSyntaxTree || this.getSyntaxTree( text, options.src );

			options.standard = this.findJscsConfigInComments( syntaxTree.comments ) || options.standard;

			if ( options.standard ) {
				standard = this.loadStandard ( options.standard );
				utils.extend( standard, rulesetOverrides );
			} else {
				standard = rulesetOverrides;
			}
			if ( !standard ) {
				throw new TypeError( "Cannot infer coding standard" );
			}

			analizer = new SyntaxAnalizer( standard );
			mediator.subscribe( "violation", function( sniff, errorCode, range, loc, payload ){
				logger.log( sniff, errorCode, range, loc, payload );
			});
			analizer.loadSniffs( sourceCode, mediator, new TokenIterator( syntaxTree.tokens ) );
			analizer.validateStandard();
			analizer.applySourceCodeSniffs();
			analizer.applyTokenSniffs( syntaxTree.tokens );
			analizer.markNestings( syntaxTree );
			analizer.applySyntaxTreeSniffs( syntaxTree );

			return logger;

		},

		/**
		* Get Esprima syntax tree
		* @access public
		* @param {string} srcCode
		* @param {string|undefined} [fileInfo]
		* @returns {Object}
		*/
		getSyntaxTree: function( srcCode, fileInfo ) {
			var syntaxTree;
			try {
				syntaxTree = esprima.parse( srcCode, {
					comment: true,
					range: true,
					tokens: true,
					loc: true
				});
			} catch( e ) {
				throw new SyntaxError( "Apparently your source code " +
					( fileInfo ? "('" + fileInfo + "') " : "" ) +
					"isn't valid EcmaScript (" + e.message + "). " );
			}
			return syntaxTree;
		},

		/**
		* Try to make instance of a given standard
		* @access public
		* @param {string} standardName
		* @returns {Object}
		*/
		loadStandard: function( standardName ) {
			var standard;
			try {
				standard = require( "../standard/" + standardName );
				if ( !standard ) {
					throw new ReferenceError( "Cannot find " + standardName + " standard definition " );
				}
			} catch( e ) {
				throw new ReferenceError( "Cannot find " + standardName + " standard definition " );
			}
			return standard;
		},
		/**
		* Parse source code block comments for @jscs option instructions
		* @access public
		* @param {Object[]} comments
		* @returns {string}
		*/
		findJscsConfigInComments: function( comments ) {
			var testRe = /@?jscs\s+standard:/ig,
				matchRe = /@?jscs\s+standard:\s*([a-zA-Z0-9_]+)/i,
				standardName;
			comments.forEach(function( c ){
				var matches;
				if ( c.type === "Block" && testRe.test( c.value ) ) {
					matches = c.value.match( matchRe );
					standardName = (matches && matches[ 1 ]) || null;
				}
			});
			return standardName;
		}
		};
	};
});