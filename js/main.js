/**
 * @module main
 * @param {jQuery] $
 * @param {function] esprima
 * @param {Sniffer] Sniffer
 * @param {Object] en
 * @param {Dictionary] Dictionary
 */
define([
	"./Source",
	"./ContentEditable"
	], function( Source, ContentEditable ) {
var document = window.document,
		util = {
			/**
			 * Bind a function to a context, optionally partially applying any arguments.
			 * @param {function} fn
			 * @param {Object} context
			 * @returns {function}
			 */
			proxy: function( fn, context ) {
				var args, proxy, slice = [].slice;
				// Simulated bind
				args = slice.call( arguments, 2 );
				proxy = function() {
					return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
				};
				return proxy;
			},
			addClass: function( el, name ) {
				if ( typeof el.className !== "undefined" ) {
					this.removeClass( el, name );
					el.className += " " + name;
				}
			},
			removeClass: function( el, name ) {
				if ( typeof el.className !== "undefined" ) {
					el.className = el.className.replace( new RegExp( "\b" + name + "\b" ), "" );
				}
			}
		},
		/**
		 * Represents view of source code
		 * @constructor
		 * @param {Node} $boundingBox
		 */
		SourceView = function( $boundingBox ) {
			var $content = $boundingBox.querySelector( ".textViewContent" ),
					$ruller = $boundingBox.querySelector( ".textViewLeftRuller" ),
					$report = document.getElementById( "jscs-report" ),

					editable = new ContentEditable( $content ),
					timer = null;
			return {
				bindUi: function() {
					// Update when code is copy-pasted
					$content.addEventListener( "change", util.proxy( this.keyupHandler, this ), false );
					// Update when code is typed
					$content.addEventListener( "input", util.proxy( this.keyupHandler, this ), false );
					$content.addEventListener( "scroll", util.proxy( this.syncCodeRullerScroll, this ), false );
				},
				syncCodeRullerScroll: function() {
					$ruller.scrollTop = $content.scrollTop;
				},

//				htmlToPlain: function( html ) {
//					return html
//						.replace( /\<br\s?\/?\>/gi, "\n" )
//						.replace( /\t/g, "  " )
//						.replace( /\&nbsp;/gi, " " )
//						.replace( /(<([^>]+)>)/ig, "" );
//				},
//				plainToHtml: function( text ) {
//					return text
//						.replace( /\n/g, "<br>" );
//				},

				keyupHandler: function() {
					var that = this;
					if ( timer ) {
						clearTimeout( timer );
					}
					timer = setTimeout(function(){
						that.updateContainer();
					},300 );

				},
				renderRuller: function( lines ){
					var i = 1, html = "";
					for ( ; i <= lines; i++ ) {
						html += "<div data-line=\"" + i + "\">" + i + "</div>";
					}
					$ruller.innerHTML = html;
				},



				renderReport: function( messages ){
					var html = "";
					if ( !messages.length ) {
						return;
					}
					html + "<thead><tr><th>Line</th><th>Col.</th><th>Message</th></tr></thead>\n<tbody>";
					messages.forEach(function( msg ){
						html += "<tr><td>" + msg.loc.start.line +
							"</td><td>" + msg.loc.start.column +
							"</td><td>" + msg.message + "</td></tr>\n";
					});
					$report.innerHTML = html + "</tbody>";
				},

				markWarningLines: function( messages ){
					var i, nList = $ruller.querySelectorAll( "div" );
					for( i in nList ) {
						if ( nList.hasOwnProperty( i ) ) {
							util.removeClass( nList[ i ], "warning-line" );
						}
					}
					messages.forEach(function( msg ){
						var el = $ruller.querySelector( "div[data-line=\"" + msg.loc.start.line + "\"]" );
						el && util.addClass( el, "warning-line" );
					});
				},

				getText: function() {
					$content.innerHTML = $content.innerHTML.replace( /\<br\s?\/?\>/gi, "\n" );
					return $content.textContent;
				},

				updateContainer: function() {
					var text, srcCode, caretOffset;

					caretOffset = editable.saveSelection();
					text = this.getText();

					srcCode = new Source( text, caretOffset );
					this.renderRuller( text.split( "\n").length );
					$content.focus();

					text = srcCode
						.highlightAll()
						.getText();

					$content.innerHTML = text.split( "\n" ).join( "<br>" );
					this.renderReport( srcCode.getMessages() );
					this.markWarningLines( srcCode.getMessages() );
					this.syncCodeRullerScroll();
					editable.restoreSelection();

				}
			};
		};

// Start as soon as DOM is ready
require([ "./js/vendors/requirejs/domReady" ], function ( domReady ) {
  domReady(function () {
    var view = new SourceView( document.getElementById( "textView" ) );
		view.bindUi();
  });
});



});