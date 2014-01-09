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
  * A module providing common utilites for sniffers
  * @module Sniff/Utils
  */
define(function() {
"use strict";
  /**
  * @constructor
  * @alias module:Sniff/Utils
  */
  return {
  validateRule: function( rule, prop, type, isRequired ) {
    if ( !isRequired && !rule.hasOwnProperty( prop ) ) {
    return;
    }
    if ( type === "array" ) {
    if ( !Array.isArray( rule[ prop ] ) ) {
      throw new TypeError( "rule." + prop + " must be a " + type );
    }
    return;
    }
    if ( rule.hasOwnProperty( prop ) && typeof rule[ prop ] !== type ) {
    throw new TypeError( "rule." + prop + " must be a " + type );
    }
  },
  normalizeRule: function( rule, prop ) {
    if ( rule[ prop ] &&  rule[ prop ] > 1 ) {
    rule[ prop ] = 2;
    }
  }
  };
});