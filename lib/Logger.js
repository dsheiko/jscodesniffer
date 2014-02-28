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
* A module representing Logger
* @module lib/Logger
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

define(function() {
"use strict";
	/**
	* @constructor
	* @alias module:lib/Logger
	*/
	return function() {
	var messages = [];
	/** @lends module:lib/Logger.prototype */
	return {
		/**
		* Log message
		* @access public
		* @param {string} sniff
		* @param {string} errorCode
		* @param {Array} range
		* @param {Object} loc
		* @param {Object} payload
		*/
		log: function( sniff, errorCode, range, loc, payload ) {
			// Prevent repeating messages
			if ( messages.filter(function( msg ){
				return msg.range[ 0 ] === range[ 0 ] && msg.range[ 1 ] === range[ 1 ] && msg.errorCode === errorCode;
			}).length ) {
				return;
			}
			messages.push({
				sniff: sniff,
				errorCode: errorCode,
				range: range,
				loc: loc,
				payload: payload
			});
		},
		/**
		* Get all the collected messages
		* @access public
		* @returns {Array}
		*/
		getMessages: function() {
			return messages;
		}
	};
	};
});
