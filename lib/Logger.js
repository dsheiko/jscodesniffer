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
  * A module representing Logger
  * @module Logger
  */
define( function () {
"use strict";
  var messages = [];
  /**
    * @constructor
    * @alias module:Logger
    */
  return function() {
    return {
      /**
       * Log message
       * @param {string} sniff
       * @param {string} errorCode
       * @param {Array} range
       * @param {object} loc
       * @param {object} payload
       */
      log: function( sniff, errorCode, range, loc, payload ) {
        // Prevent repeating messages
        if ( messages.filter(function( msg ){
          return msg.range[ 0 ] === range[ 0 ] && msg.range[ 1 ] === range[ 1 ] && msg.errorCode === errorCode;
        }).length ) {
          return;
        }
        messages.push( {
          sniff: sniff,
          errorCode: errorCode,
          range: range,
          loc: loc,
          payload: payload
        });
      },
      /**
       * Get all the collected messages
       * @return {Array}
       */
      getMessages: function() {
        return messages;
      },
      /**
       * Reset logs (testing)
       */
      reset: function() {
        messages = [];
      }
    };
  };
});
