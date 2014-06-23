/*
* @author sheiko
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* jscs standard:Jquery
* jshint unused:false
*/

/**
	* @module Splicer
	* @constructor
	* @alias module:Splicer
	* @param {string} srcCode
	* @param {Array[]} tokens
	*/

define(function(){

	var Splicer = function() {
			"use strict";

			var chunks = [];


			return {

				/**
				 * Push a new range for a class into chunks array
				 * @access public
				 * @param {number[]} range
				 * @param {string|string[]} classes
				 * @return {void}
				 */
				push: function( range, classes ){
					var isTerminated = false,
							splicer = null,
							whenNewInsideExisting = function( chunk, inx  ) {
								chunks[ inx ].splicer = new Splicer();
								chunks[ inx ].splicer.push( range, classes );
							},
							whenExistingInsideNew = function( chunk, inx ) {
								splicer = splicer || new Splicer();
								splicer.push( chunk.range, chunk.classes );
							},
							whenTheSame = function( chunk, inx ) {
								chunks[ inx ].classes.indexOf( classes ) !== -1 && chunks[ inx ].classes.push( classes );
							};

          classes = typeof classes === "string" ? [ classes ] : classes;

					chunks.forEach(function( chunk, inx ){
						if ( range[ 0 ] > chunk.range[ 0 ] && range[ 1 ] < chunk.range[ 0 ] ) {
							isTerminated = true;
							whenNewInsideExisting( chunk, inx );
						}
						if ( chunk.range[ 0 ] > range[ 0 ] && chunk.range[ 0 ] < range[ 1 ] ) {
							isTerminated = true;
							whenExistingInsideNew( chunk, inx );
						}
						if ( chunk.range[ 0 ] === range[ 0 ] && chunk.range[ 0 ] === range[ 1 ] ) {
							isTerminated = true;
							whenTheSame( chunk, inx );
						}
					});

					if ( isTerminated ) {
						return;
					}
					// Normal flow
					chunks.push({
						range: range,
						classes: classes,
						splicer: null
					});
				},

				/**
				 * @access protected
				 * @return {void}
				 */
				reorder: function() {
					chunks.sort(function( prev, next ){
						return prev.range[ 0 ] < next.range[ 0 ];
					});
				},



				splice: function( srcCode ) {
					var offset = 0, out = "";
					this.reorder();
					chunks.forEach(function( chunk ){
						var fragment = srcCode.substr( chunk.range[ 0 ], chunk.range[ 1 ] );
						if ( chunk.splicer !== null ) {
							chunk.splicer.splice( fragment );
						}
						out += srcCode.substr( offset, chunk.range[ 0 ] ) +
						"<span class=\"" + chunk.classes.join( " " ) + "\">" +
							fragment  + "</span>";
						offset = chunk.range[ 1 ];
					});
					out += srcCode.substr( offset );
          return out;
				}


		};
	};
  return Splicer;
});
