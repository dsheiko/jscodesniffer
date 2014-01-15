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
	* @param {function} factory
	*/
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* A module representing a formatter.
	* @module Formatter/Xml
	* @param {Object} config
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
			* Render header of the report
			* @access public
			* @return {string}
			*/
			header: function() {
				return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + "\n" +
					"  <jscs version=\"" + config.version + "\">" + "\n";
			},
			/**
			* Render body of the report
			* @access public
			* @param {string} path
			* @param {Object[]} messages
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
			* Render footer of the report
			* @access public
			* @return {string}
			*/
			footer: function() {
				return "</jscs>" + "\n";
			}
		};
	};
});