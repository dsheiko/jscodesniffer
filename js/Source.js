/*
* @author sheiko
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* jscs standard:Jquery
* jshint unused:false
*/

/**
 * Represents source code
 * @module Source
 * @param {function} esprima
 * @param {function} Sniffer
 * @param {Object} en
 * @param {function} Dictionary
 * @param {function} Replacer
 * @returns {Source}
 */
define([
	"./vendors/esprima/esprima",
	"../lib/Sniffer",
	"../lib/Dictionary/en",
	"../lib/Dictionary",
	"./Splicer"
], function( esprima, Sniffer, en, Dictionary, Splicer ){
	/**
	 *
	 * @constructor
	 * @alias module:Source
	 * @param {string} text
	 * @param {number} caretOffset
	 */
	return function( text, caretOffset ) {
		var HIGHLIGHT_TYPES = [ "Keyword", "Numeric", "String" ],
				sniffer = new Sniffer( esprima ),
        dictionary = new Dictionary( en ),
				splicer = new Splicer(),
				messages = [];
			return {
				/**
				 * Getter
				 * @access public
				 * @returns {string}
				 */
				getText: function() {
          console.log( 2, splicer.splice( text )  );
					return splicer.splice( text );
				},

				/**
				* Get an instance from the source code reduced according to given left and right positions
				* @access protected
				* @param {number} lPos
				* @param {number} rPos
				* @returns {string}
				*/
				extract: function( lPos, rPos ) {
					// Boundaries
					lPos = lPos < 0 ? 0 : lPos;
					rPos = rPos >= text.length ? text.length -1 : rPos;
					return text.substr( lPos, rPos - lPos );
				},
				/**
				 * Generate esprima syntax tree
				 * @access protected
				 * @param {string} text
				 * @returns {Object} syntaxTree
				 */
				getSyntaxTree: function( text ) {
					return esprima.parse( text, {
						comment: true,
						range: true,
						tokens: true,
						loc: true,
						tolerant: true
					});
				},
				/**
				 * Highlight source JavaScript syntax using replacer
				 * @access protected
				 * @param {Object} syntaxTree
				 */
				highlightSyntax: function( syntaxTree ) {
					// Highlight keywords
					syntaxTree.tokens && syntaxTree.tokens.forEach(function( token ){
						if ( HIGHLIGHT_TYPES.indexOf( token.type ) !== -1 ) {
							splicer.push( token.range, [ "token-" + token.type.toLowerCase() ]);
						}
					});
					// Highlight comments
					syntaxTree.comments && syntaxTree.comments.forEach(function( comment ){
						if ( comment.type === "Block" ) {
							splicer.push( comment.range, [ "token-block-comment" ]);
						}
						if ( comment.type === "Line" ) {
							splicer.push( comment.range, [ "token-line-comment" ]);
						}
					});
					return this;
				},

				/**
				 * Get standard vialation messages from jscs
				 * @access protected
				 * @param {Object} syntaxTree
				 */
				getWarnings: function( syntaxTree ) {
					var logger, customStandard = {};
					try {
						try {
							customStandard = JSON.parse( document.getElementById( "standard" ).value );
						} catch( err ) {
							// mute
						}
						// Get sniffer report
						logger = sniffer.getTestResults( text, { standard: "Jquery" }, customStandard, syntaxTree );
						// Translate messages
						messages = dictionary.translateBulk( logger.getMessages(), true );
					} catch( err ) {
						console.error( "JSCS: " + err.message );
					}
					return this;
				},
				/**
				 * Highlight warnings using replacer
				 * @access protected
				 */
				highlightWarnings: function() {
							/**
							 * Keep track of marking up in source
							 * @type {array[]}
							 */
					messages.forEach(function( message, inx ){
						var dir;


						splicer.push( message.range, [ "warning" ]);

						// When no spacing found but some exprected
	//					if ( message.range[ 0 ] === message.range[ 1 ] ) {

//							if ( doesInterfereWithPrevMarkup( message.range[ 0 ], message.range[ 0 ] ) ) {
//								return;
//							}
//							markups.push([ message.range[ 0 ], message.range[ 0 ] ]);
//							dir = message.payload.where === "<" ? "left" : "right";
//							replacer.replace( message.range[ 0 ], message.range[ 0 ], "<span data-index=\"" + inx +
//								"\" class=\"warning cond\"><span class=\"empty\"></span></span>" );
//								return;
//						}
						// Other cases
//						if ( message.payload.excerpt ) {
//							if ( doesInterfereWithPrevMarkup( message.range[ 0 ], message.range[ 1 ] ) ) {
//								return;
//							}
//							markups.push([ message.range[ 0 ], message.range[ 1 ] ]);
//							replacer.replace( message.range[ 0 ], message.range[ 1 ], "<span data-index=\"" + inx +
//								"\" class=\"warning\">" + message.payload.excerpt +
//								"</span>" );
//						}

					});
					return this;
				},
				/**
				 * Getter
				 * @access public
				 * @returns {Object[]}
				 */
				getMessages: function() {
					return messages;
				},

				/**
				 * Do all the highlighting on a given text (source code)
				 * @returns {SrcCode}
				 */
				highlightAll: function() {
					var syntaxTree = null;
					try {
						syntaxTree = this.getSyntaxTree( text );
					} catch( err ) {
						//
					}
					if ( !syntaxTree ) {
						return this;
					}

					splicer.push([ caretOffset, caretOffset ], "caret-offset" );

					this
						.highlightSyntax( syntaxTree )
						.getWarnings( syntaxTree )
						.highlightWarnings();
					return this;
				}
			};
		};
});