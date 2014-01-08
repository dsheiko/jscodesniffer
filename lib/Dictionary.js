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
  * A module representing Dictionary
  * @module Dictionary
  */
define( function() {
  /**
    * @constructor
    * @alias module:Dictionary
    */
return function( dictionary ) {
  dictionary = dictionary || require( "./Dictionary/en.js" );
  return {
    /**
      * Get a message by key
      * @param {string} key
      * @returns {string}
      */
    getMsg: function( key ) {
      if ( !dictionary[ key ] ) {
        throw new ReferenceError( "Invalid key " + key );
      }
      return dictionary[ key ];
    },
    /**
      * Get human-readable numbers
      * @param {number} input
      * @returns {string}
      */
    numToString: function( input ) {
      if ( typeof input !== "number" ) {
        return input;
      }
      return input > 1 ? "multiple" : ( input === 0 ? "no" : "one" );
    },
    /**
    * Build a human-readable message
    *
    * @param {string} key
    * @param {number} actualNum
    * @param {number} expectedNum
    * @returns {string}
    */
    translate: function( key, actualNum, expectedNum ) {
      var reExp = /\{expected\}/,
          reAct = /\{actual\}/;
      return this.getMsg( key )
        .replace( reExp, this.numToString( expectedNum ) )
        .replace( reAct, this.numToString( actualNum ) );
    },
    /**
    * Translate array of messages
    * @param {Array} messages
    * @param {boolean} asPlainText
    * @return {Array} messages
    */
    translateBulk: function( messages, asPlainText ) {
      var that = this,
          re = /\[\/?color:?[a-z]*\]/gm;
      return messages.map( function( msg ){
        msg.message = msg.payload ? that.translate( msg.errorCode, msg.payload.actual, msg.payload.expected ) :
          that.getMsg( msg.errorCode );
        if ( asPlainText ) {
          msg.message = msg.message.replace( re, "" );
        }
        return msg;
      });
    }
  };
};
});
