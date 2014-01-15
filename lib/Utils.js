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
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}


define(function() {

/**
	* A module representing shared utilites.
	* @module Utils
	*/
var utils = {
		BEAUTIFY: true,
		CONSOLE_COLORS: {
		"black": "0;30",
		"dark gray": "1;30",
		"blue": "0;34",
		"light blue": "1;34",
		"green": "0;32",
		"light green": "1;32",
		"cyan": "0;36",
		"light cyan": "1;36",
		"red": "0;31",
		"light red": "1;31",
		"purple": "0;35",
		"light purple": "1;35",
		"brown": "0;33",
		"yellow": "1;33",
		"light gray": "0;37",
		"white": "1;37",
		"underline": "4"
		},
		CONSOLE_RESET_COLOR: "\033[0m",
		/**
		* Colorize the given string outside Reporter
		* @param {string} color
		* @param {string} str
		* @return {string}
		*/
		color: function( color, str ) {
			return utils.CONSOLE_COLORS[ color ] ?
				"\033[" + utils.CONSOLE_COLORS[ color ] + "m" + str +
				utils.CONSOLE_RESET_COLOR : str;
		},

	/**
		* Replica of jQuery extend method
		*
		* @param {Object} receiver
		* @param {Object} obj
		* @return {Object}
		*/
	extend: function( receiver, obj ) {
		Object.keys( obj ).forEach(function( prop ){
			receiver[ prop ] = obj[ prop ];
		});
		return receiver;
	},
	/**
		* Replica of PHP str_repeat
		* @param {string} str
		* @param {number} repNum
		* @return {string}
		*/
	repeatStr: function( str, repNum ) {
		var out = "", i = 1;
		for ( ; i <= repNum; i++ ) {
			out += str;
		}
		return out;
	},
	/**
		* Simplified replica of PHP sprintf.
		* It works only with %(n)s search pattern
		*
		* @return {string}
		*/
	sprintf: function() {
		var re = /%\d*s/gm,
			args = Array.prototype.slice.apply( arguments ),
			tpl = args.shift(),
			matches = tpl.match( re );

		if ( !matches ) {
			return tpl;
		}
		if ( args.length < matches.length ) {
			throw new TypeError("Too few arguments");
		}

		matches.forEach(function( match ){
			var repNum = match.replace( /\D/g, "" ),
				val = args.shift() + "";
			tpl = tpl.replace( /%\d*s/m, val + utils.repeatStr( " ", repNum - val.length ) );
		});

		return tpl;
	},
	/**
		* Simplified replica of PHP wordwrap
		*
		* @param {string} str
		* @param {number} width
		* @return {string}
		*/
	wordwrap: function( str, width ) {
		var MIN_WRAP_WIDTH = 62,
			words = str.split( " " ),
			i = 0,
			lines = [],
			getPlainText = function( markdown ) {
				return markdown.replace( /(\[.*?\])/gm, "" );
			};

		width = width || MIN_WRAP_WIDTH;
		words.forEach(function( w ){
			if ( typeof lines[ i ] === "undefined" ) {
				lines[ i ] = "";
			}
			if ( getPlainText( lines[ i ] + w ).length <= width ) {
				lines[ i ] += w + " ";
			} else {
				lines[ ++i ] = w + " ";
			}
		});

		return lines.join( "\n" );
	},
	/**
		* Replica of PHP ucfirst
		* @param {string} str
		* @return {string}
		*/
	ucfirst: function( str ) {
		return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
	}
};

return utils;

});