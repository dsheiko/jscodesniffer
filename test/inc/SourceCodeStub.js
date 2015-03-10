/**
*
* @param {string} text
*/
var SourceCodeMock = function( text ) {
  return {
    get:  function() {
      return text;
    },
    filter: function( char ) {
      return  new SourceCodeMock( text.replace( new RegExp( char, "g" ), "" ) );
    },

    find: function( char ) {
      return text.indexOf( char );
    },

    match: function( re ) {
      return text.match( re );
    },

    length: function() {
      return text.length;
    },

    extract: function( lPos, rPos ) {
      return new SourceCodeMock( text.substr( lPos, rPos - lPos ) );
    },

    asLines: function() {
      return text.split( "\n" );
    },

    debug: function() {
      var re = /\s/g;
      return text.replace( re, "_" );
    },
    fill: function( lPos, rPos, rChar ) {
      var reWs = /\s/g,
          reAny = /./g;
      rChar = rChar || " ";
      return new SourceCodeMock(
        text.substr( 0, lPos ) +
        text
          .substr( lPos, rPos - lPos )
          .replace( reWs, rChar )
          .replace( reAny, rChar ) +
        text.substr( rPos ) );
    }
  };
};
module.exports = SourceCodeMock;