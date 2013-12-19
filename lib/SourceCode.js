/*
 * @package jscodesniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === 'object' && typeof define !== 'function' ) {
    var define = function ( factory ) {
        module.exports = factory( require, exports, module );
    };
}
define(function ( require, exports, module ) {
  /**
   * Abstracts source code
   * @param {string} text
   */
  var SourceCode = function( text ) {
      if ( typeof text !== "string" ) {
        throw new TypeError( "Invalid source code" );
      }
      return {
        /**
         * Get index within the source code instance of the first occurrence of a given substring
         * Check if the source code instance contains a given substring === -1
         * @param {string} char
         * @return {number}
         */
        find: function( char ) {
          return text.indexOf( char );
        },
        /**
         * Get an instance of the source code with a given substring removed
         * @param {string} char
         * @return {object}
         */
        filter: function( char ) {
          return  new SourceCode( text.replace( new RegExp( char, "g" ), "" ) );
        },
        /**
         * Get length of the source code
         * @returns {number}
         */
        length: function() {
          return text.length;
        },
        /**
         * Get the source code as an array of lines
         * @returns {array}
         */
        asLines: function() {
          return text.split( "\n" );
        },
        /**
         * Get an instance from the source code reduced according to given left and right positions
         * @param {number} lPos
         * @param {number} rPos
         * @returns {object}
         */
        extract: function( lPos, rPos ) {
          return new SourceCode( text.substr( lPos, rPos - lPos ) );
        }
      };
    };
    return SourceCode;
});

