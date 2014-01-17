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
	* @param {function( function, Object, Object )} factory
	*/
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* A module providing common utilites for sniffers
	* @module Sniff/ReservedWords
	*/
define(function() {
"use strict";
	/**
	* @constructor
	* @alias module:Sniff/ReservedWords
	*/

	return [
		"break",
		"case",
		"catch",
		"continue",
		"debugger",
		"default",
		"delete",
		"do",
		"else",
		"finally",
		"for",
		"function",
		"if",
		"in",
		"instanceof",
		"new",
		"return",
		"switch",
		"this",
		"throw",
		"try",
		"typeof",
		"var",
		"void",
		"while",
		"with",

		// ECMAScript 1

		"const",
		"debugger",
		"default",
		"enum",
		"export",
		"extends",
		"finally",
		"import",
		"super",


		// ECMAScript 2

		"abstract",
		"boolean",
		"byte",
		"case",
		"catch",
		"char",
		"class",
		"const",
		"debugger",
		"default",
		"do",
		"double",
		"enum",
		"export",
		"extends",
		"final",
		"finally",
		"float",
		"goto",
		"implements",
		"import",
		"instanceof",
		"int",
		"interface",
		"long",
		"native",
		"package",
		"private",
		"protected",
		"public",
		"short",
		"static",
		"super",
		"switch",
		"synchronized",
		"throw",
		"throws",
		"transient",
		"try",
		"volatile",

		// ECMAScript 3
		"abstract",
		"boolean",
		"byte",
		"char",
		"class",
		"const",
		"debugger",
		"double",
		"enum",
		"export",
		"extends",
		"final",
		"float",
		"goto",
		"implements",
		"import",
		"int",
		"interface",
		"long",
		"native",
		"package",
		"private",
		"protected",
		"public",
		"short",
		"static",
		"super",
		"synchronized",
		"throws",
		"transient",
		"volatile",

		// ECMAScript 5
		"lass",
		"enum",
		"export",
		"extends",
		"import",

		"implements",
		"interface",
		"let",
		"package",
		"private",
		"protected",
		"public",
		"static",
		"yield"
	];
});