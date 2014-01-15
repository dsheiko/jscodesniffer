/**
 * @module main
 */
define([
	"jquery",
	"./esprima",
	"../lib/Sniffer",
	"../lib/Dictionary/en",
	"../lib/Dictionary",
	], function( $, esprima, Sniffer, en, Dictionary ) {
    $(function() {
		var sh = window.SyntaxHighlighter,
        document = window.document,
				sniffer = new Sniffer( esprima ),
        dictionary = new Dictionary( en ),
				/**
				* @namespace
				* @access private
				*/
			 utils = {
				 /**
				 * Replica of PHP str_repeat
				 * @access public
				 * @param {string} str
				 * @param {number} repNum
				 * @returns {string}
				 */
				 repeatStr: function( str, repNum ) {
					 var out = "", i = 1;
					 for ( ; i <= repNum; i++ ) {
						 out += str;
					 }
					 return out;
				 },
				 /**
					* Escape unsafe characters before output as html
					* @param {string} str
					* @returns {string}
					*/
				 htmlEntities: function( str ) {
							 var amRe = /&/g,
									 ltRe = /</g,
									 gtRe = />/g,
									 quRe = /"/g;
							 return String( str ).replace( amRe, '&amp;' )
									 .replace( ltRe, '&lt;' )
									 .replace( gtRe, '&gt;' )
									 .replace( quRe, '&quot;' );
					}
			 },
				/**
				 * Module representing code view
				 * @module
				 */
        codeView = (function(){
					var
							/**
							 * @var {jQuery}
							 */
							_view,
							/**
							 * @var {jQuery}
							 */
							_message,
							/**
							 * @var {jQuery}
							 */
							_container,
							/**
							 * Messages categorized by lines
							 * @var { line: Object }
							 */
							indexedMessages = {},
							/**
							* Translate all the collected messages
							* @param {Object[]} messages
							* @returns {Object[]}
							*/
							parseMarkup = function( messages ) {
								return $( messages ).map(function(inx, el) {
										var oRe = /\[color:yellow\]/g,
												cRe = /\[\/color\]/g;
										el.message = el.message.replace( oRe, "" );
										el.message = el.message.replace( cRe, "" );
										return el;
								});
							};
					return {
							init: function() {
									_view = $( "#srcview" );
									_message = _view.find( "p.message" );
									_container = _view.find( "div.container" );
							},
							message : function( message, classname ) {
									_message.html( message + '<a href="#reset">&#9660;</a>' );
									_message.attr( "class", "message " + classname );
							},
							show : function( code ) {
									_view.show();
									_container.empty();
									_container.html( "<pre id=\"codeview\" class=\"brush: js\">" +
											utils.htmlEntities( code ) + "</pre>" );
									sh.highlight( {}, _container.find("#codeview").get( 0 ) );
							},

							/**
							 * Go through code lines syntax-highlighed
							 */
							highlightCode: function() {
									var that = this;
									_container.find( "tbody > tr > .code > .container > div" ).each(function( inx, el ){
											if ( indexedMessages[ inx + 1 ] ) {
													that.highlightCodeLine( $( el ), indexedMessages[ inx + 1 ], inx );
											}
									});
							},
							/**
							 * Create an overlay positioned just over the concern spot
							 *
							 * @param {jQuery} el
							 * @param {object[]} messages
							 * @param {number} lineInx - 0..
							 */
							highlightCodeLine: function( el, messages, lineInx ) {
									//$( ".overlay" ).remove();
									$.each( messages, function( inx, obj ) {
											var indicator,
													overlay,
													indicatorNum = 1;

											if ( obj.loc.start.column === obj.loc.end.column ) {
												indicatorNum = obj.loc.end.column - obj.loc.start.column;
											} else {
												indicatorNum = codeSource.asLines[ lineInx ].length - obj.loc.start.column;
											}

											indicatorNum = indicatorNum || 1;
											indicator	= utils.repeatStr( "_", indicatorNum );
											overlay = $( '<div class="overlay" title="' +
													obj.message + '">' + indicator + '</div>' ).prependTo( el );

											overlay
												.get( 0 )
												.style
												.cssText = "left: " + ( ( obj.loc.start.column * 8 ) + 8 ) + "px !important";

											overlay.off( "mouseenter" ).on( "mouseenter", function( e ){
												// Show up hint
												logView.activate( obj.loc.start.line, obj.loc.start.column );
											});
											// Hide hint
											overlay.off( "mouseleave" ).on( "mouseleave", logView.deactivate );
									});

							},
							/**
							 * Collect message bulks per line
							 * this~indexedMessages[ line ] = [ ..messageObj ]
							 * @param {object[]} messages
							 */
							assignMessages: function( messages ) {
									$.each( parseMarkup( messages ), function( inx, el ){
											indexedMessages[ el.loc.start.line ] = indexedMessages[ el.loc.start.line ] || [];
											indexedMessages[ el.loc.start.line ].push( el );
									});
							},
							highlightLines: function() {
									_container.find( "tbody > tr > .code > .container > div" ).each(function( inx, val ){
											if ( indexedMessages[ inx + 1 ] ) {
													$( val ).addClass( "warning-line" );
											}
									});
							},
							reset: function() {
									indexedMessages = {};
									_container.empty();
									_view.hide();
							}
            }
        }()),
				/**
				 * Module representing log view
				 * @module
				 */
        logView = (function(){
            var _view,
                _container,
                _table;
                parseMarkup = function( message ) {
                    var oRe = /\[color:yellow\]/g,
                        cRe = /\[\/color\]/g;
                    message = message.replace( oRe, "<span>" );
                    message = message.replace( cRe, "</span>" );
                    return message;
                };
            return {
                init: function() {
                    _view = $( "#srclog" );
                    _container = _view.find( "div.container" );
                },
								/**
								 * @param {object[]} messages
								 */
                show : function( messages ) {
                    var html = '<table><thead>' +
                        '<tr><th>Line</th><th>Col</th><th>Warning</th></tr></thead><tbody>';
                    $.each( messages, function( inx, val ){
                        html += '<tr id="log' + val.loc.start.line + '-' + val.loc.start.column + '">' +
                            '<td>' + val.loc.start.line + '</td>' +
                            '<td>' + val.loc.start.column + '</td>' +
                            '<td>' + parseMarkup( val.message ) + '</td></tr>';
                    });
                    html += "</tbody></table>";
                    _container.empty();
                    _table = $( html ).appendTo( _container );
                    _view.show();
                },
								/**
								 * Show up hint
								 * @param {number} line
								 * @param {number} column
								 */
                activate: function( line, column ) {
                    var tr = _table.find( "tr#log" + line + "-" + column );
                    tr.addClass( "active" );
                    tr.position() && _container.scrollTop( tr.position().top );
                },
								/**
								 * Hide hint
								 */
                deactivate: function() {
                    _table.find( "tr" ).removeClass( "active");
                },
                reset: function() {
                    _container.empty();
                    _view.hide();
                }
            }
        }()),
				/**
				 * Module representing source code
				 * @module
				 */
        codeSource = (function(){
            var _view,
                _reset;
            return {
                init: function() {
                    _view = $( "#srccode");
                    _reset = $( "#reset");
                },
								asLines: [],
								normalizeSourceCode: function( code ) {
									var re = /\r/;
									return code.replace( re, "" );
								},
                syncUi: function() {
									var that = this;
									_reset.on( "click", function( e ){
											e.preventDefault();
											codeView.reset();
											logView.reset();
											codeSource.reset();
											$( this ).hide();
											$( document ).scrollTop( 0 );
									});
									_view.on( "submit", function( e ){
											var code = $( this ).find( "textarea").val(),
													standard = $( this ).find( "select[name=standard]").val(),
													logger,
													messages;
											e.preventDefault();
											$( this ).hide();

											that.asLines = that.normalizeSourceCode( code ).split( "\n" );

											try {
												// Get sniffer report
												logger = sniffer.getTestResults( code, { standard: standard } );
												// Translate messages
												messages = dictionary.translateBulk( logger.getMessages(), true );

												 // standard = logger.standard;
												 if ( !messages.length  ) {
														 codeView.message( 'Congratulations! Your code does not violate "' +
																 standard + '" standard', 'success');
														 codeView.show( code );
														 _reset.show();
														 return;
												 }

												 codeView.message( 'Your code violates "' +
														 standard + '" standard. Please, find details in Error Log window below', 'fail');
												 codeView.show( code );
												 logView.show( messages, 'fail' );
												 _reset.show();

												 $( "#codeview").ready(function(){
														 codeView.assignMessages( messages );
														 codeView.highlightLines();
														 codeView.highlightCode();
												 });
											} catch( e ) {
												 codeView.message( 'Apparently that is invalid JavaScript syntax.', 'fail' );
												 codeView.show( code );
												 _reset.show();
											}
									});
                },
                reset: function() {
                    _view.show();
                }
            }
        }());


				$( document ).ready(function(){
					sh && sh.highlight();
					logView.init();
					codeView.init();
					codeSource.init();
					codeSource.syncUi();
				});

    });
});