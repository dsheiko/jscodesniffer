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
  * A module representing Mediator
  * @module Mediator
  */
define(function() {
  /**
  * Implements mediator pattern
  * @constructor
  * @alias module:Mediator
  */
var Mediator = function(){
  return {
    channels: {},
    /**
      * Publish to a given channel
      * Example:
      * mediator.publish( channel, sniff, errorCode, range, loc, payload )
      *
      * @param {string} channel
      */
    publish: function( channel ){
      var args, i = 0, l, subscription;
      if ( !this.channels[ channel ] ) {
        return false;
      }
      args = Array.prototype.slice.call( arguments, 1 );
      l = this.channels[ channel ].length;
      for ( ; i < l; i++ ) {
        subscription = this.channels[ channel ][ i ];
        subscription.callback.apply( this, args );
      }
      return this;
    },
    /**
      * Subscribe to a given channel
      * @param {string} channel
      * @param {function} fn
      */
    subscribe: function( channel, fn ){
      if ( typeof channel !== "string" ) {
        throw new TypeError( "Invalid parameter. Channel must be a string" );
      }
      if ( typeof fn !== "function" ) {
        throw new TypeError( "Invalid parameter. Fn must be a function" );
      }
      if ( !this.channels[ channel ] ) {
        this.channels[ channel ] = [];
      }
      this.channels[ channel ].push({ callback: fn });
      return this;
    }
  };

  };
  return Mediator;
});