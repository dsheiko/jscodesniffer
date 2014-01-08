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
/**
  * A module representing Sniffer
  * @module Sniffer
  */
define(function( require ) {
"use strict";
var esprima = require( "../node_modules/esprima/esprima" ),
    SourceCode = require( "./SourceCode" ),
    SyntaxAnalizer = require( "./SyntaxAnalizer" ),
    Mediator = require( "./Mediator" ),
    utils = require( "./Utils" ),
    Logger = require( "./Logger" );

    /**
    * Workaround for http://requirejs.org/docs/errors.html#notloaded
    */
    if ( typeof requirejs === "function" ) {
      require( "../standard/Jquery" );
      require( "../standard/Idiomatic" );
    }

return function() {
      return {
        /**
          * Lint source code and get results wrapped in a Logger instance
          * @constructor
          * @alias module:Sniffer
          * @param {string} text
          * @param {object} options - reference
          * @param {object} rulesetOverrides
          * @returns {object}
          */
        getTestResults: function( text, options, rulesetOverrides ) {
          var analizer,
              syntaxTree,
              standard,
              re = /\r/gm,
              logger = new Logger(),
              sourceCode,
              mediator = new Mediator();

          // Normalize source code
          text = text.replace( re, "" );
          sourceCode = new SourceCode( text );

          if ( !sourceCode.length ) {
            throw new TypeError("Please pass in your source code");
          }

          rulesetOverrides = rulesetOverrides || {};


          syntaxTree = this.getSyntaxTree( text );

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
          analizer.loadSniffs( sourceCode, mediator );
          analizer.validateStandard();

          analizer.applySourceCodeSniffs();
          analizer.applyTokenSniffs( syntaxTree.tokens );
          analizer.applySyntaxTreeSniffs( syntaxTree );

          return logger;

        },

        /**
          * Get Esprima syntax tree
          * @param {string} srcCode
          * @returns {object}
          */
        getSyntaxTree: function( srcCode ) {
          var syntaxTree;
          try {
            syntaxTree = esprima.parse( srcCode, {
              comment: true,
              range: true,
              tokens: true,
              loc: true
            });
          } catch( e ) {
            throw new SyntaxError( "Apparently your source code isn't valid EcmaScript (" + e.message + "). " );
          }
          return syntaxTree;
        },

        /**
          * Try to make instance of a given standard
          * @param {string} standardName
          * @returns {object}
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
          * @param {Array} comments
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