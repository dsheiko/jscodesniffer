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
define( function () {
"use strict";
  return function( config ) {
    return {
      /**
        * @return {string}
        */
      header: function() {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + "\n" +
            "  <checkstyle version=\"" + config.version + "\">" + "\n";
      },
      /**
        * @return {string}
        */
      report: function( path, messages ) {
        var out = "  <file name=\"" + path + "\">" + "\n";
        if ( !messages.length ) {
            return "";
        }
        messages.forEach(function( log ){
            var re = /[\'\"\n\r]/gm;
            out += "    <error line=\"" + log.loc.start.line +
                "\" column=\"" + log.loc.start.column + "\" source=\"" + log.errorCode +
                "\" severity=\"error\" message=\"" + log.message.replace( re, "" ) + "\" />" + "\n";
        });
        return out + "  </file>" + "\n";
      },
      /**
        * @return {string}
        */
      footer: function() {
        return "</checkstyle>" + "\n";
      }
    };
  };
});