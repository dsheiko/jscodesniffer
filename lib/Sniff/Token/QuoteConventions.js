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
  * A module representing a sniffer.
  * @module Sniff/Token/QuoteConventions
  */
define(function( require ) {
"use strict";

var utils = require( "../Utils" ),
  NAME = "QuoteConventions",
  /**
  * @constructor
  * @alias module:Sniff/Token/QuoteConventions
  */
  Sniff = function( sourceCode, mediator ) {
  return {
  /**
    * Check contract
    * @param {Object} rule
    */
    validateRule: function( rule ) {
    utils.validateRule( rule, "allowDoubleQuotes", "boolean" );
    utils.validateRule( rule, "allowSingleQuotes", "boolean" );
    },
  /**
    * Run the sniffer according a given rule if a given TOKEN type matches the case
    * @param {Object} rule
    * @param {Object} token
    */
  run: function( rule, token ) {

    if ( token.type !== "String" ) {
      return;
    }

    if ( rule.hasOwnProperty( "allowDoubleQuotes" ) && !rule.allowDoubleQuotes ) {
      token.value.substr( 0, 1 ) === "\"" && this.log( token, "QuoteConventionsDoubleQuotesNotAllowed" );
    }

    if ( rule.hasOwnProperty( "allowSingleQuotes" ) && !rule.allowSingleQuotes ) {
      token.value.substr( 0, 1 ) === "'" && this.log( token, "QuoteConventionsSingleQuotesNotAllowed" );
    }

  },
  /**
    *
    * @param {Object} token
    * @param {string} code
    */
  log: function( token, code ) {
    mediator.publish( "violation", NAME, code, token.range, token.loc );
  }
  };
};
  return Sniff;
});