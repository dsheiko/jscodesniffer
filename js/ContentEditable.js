define(function(){
return function( containerEl ) {
	return {
		/**
		 * Get caret position absolute offset
		 * While working with non-text content, Range.startOffset returns number of nodes, which is
		 * useless in our case. so we do this trick
		 * @link https://developer.mozilla.org/en-US/docs/Web/API/Range.startOffset
		 * @returns {number}
		 */
		saveSelection: function() {
			// get the selection range (or cursor position)
			var range = window.getSelection().getRangeAt( 0 ),
				// Let's make a shadow range preceding the actual one
					preRange = range.cloneRange();
			preRange.selectNodeContents( containerEl );
			preRange.setEnd( range.startContainer, range.startOffset );
			// preRange.toString() gives plain text of the selection,
			// the only way to get real in-text offfset
			return preRange.toString().length;
		},
		/**
		 * Restore caret position marked with #rangeToken token node
		 */
		restoreSelection: function() {
				var range = window.getSelection().getRangeAt( 0 ),
						token = containerEl.querySelector( ".caret-offset" );
				if ( !token )	{
					return;
				}
				range.setStartAfter( token );
				containerEl.removeChild( token );
		}
	};
};
});