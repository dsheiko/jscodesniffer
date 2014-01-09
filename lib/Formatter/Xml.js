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
  * A module representing a formatter.
  * @module Formatter/Xml
  */
define(function() {
"use strict";
  /**
  * @constructor
  * @alias module:Formatter/Xml
  */
  return function( config ) {
  return {
    /**
    * @return {string}
    */
    header: function() {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + "\n" +
      "  <jscs version=\"" + config.version + "\">" + "\n";
    },
    /**
    * @param {string} path
    * @param {Array} messages
    * @return {string}
    */
    report: function( path, messages ) {
    var out = "  <file name=\"" + path + "\" errors=\"" + messages.length + "\" warnings=\"0\">" + "\n";
    if ( !messages.length ) {
      return "";
    }
    messages.forEach(function( log ){
      out += "    <error line=\"" + log.loc.start.line +
        "\" column=\"" + log.loc.start.column + "\" source=\"" + log.errorCode +
        "\" severity=\"1\">" + log.message +
        "</error>" + "\n";
    });
    return out + "  </file>" + "\n";
    },
    /**
    * @return {string}
    */
    footer: function() {
    return "</jscs>" + "\n";
    }
  };
  };
});