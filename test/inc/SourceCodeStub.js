/**
*
* @param {string} text
*/
var SourceCodeMock = function( text ) {
  return {

    filter: function( char ) {
      return  new SourceCodeMock( text.replace( new RegExp( char, "g" ), "" ) );
    },

    find: function( char ) {
      return text.indexOf( char );
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
    }
  };
};
module.exports = SourceCodeMock;