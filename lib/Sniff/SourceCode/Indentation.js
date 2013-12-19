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
define( function ( require, exports, module ) {

var NAME = "Indentation",
    utils = require( "../Utils" ),
    Sniff = function( sourceCode, mediator ) {
  return {
    /**
      * Check contract
      * @param {object} rule
      */
    validateRule: function( rule ) {
       utils.validateRule( rule, "allowOnlyTabs", "boolean" );
       utils.validateRule( rule, "allowOnlySpaces", "boolean" );
     },
     /**
     * Run the sniffer according a given rule if a given node type matches the case
     * @param {object} rule
     */
    run: function( rule ) {
      var reWs = /^(\s*)/g,
          re,
          that = this,
          lines = sourceCode.asLines();

      if ( !rule.allowOnlyTabs && !rule.allowOnlySpaces ) {
        return;
      }
      re = new RegExp( ( rule.allowOnlyTabs ? "^\t*$" : "^ *$" ), "g" );

      lines.forEach( function( line, inx ){
        var pos, matches = reWs.exec( line );

        if ( matches && !re.test( matches[ 1 ] ) ) {
          pos = lines.slice( 0, inx ).join( "\n" ).length;
          that.sniff( inx + 1, pos, matches[ 1 ].length, rule.allowOnlyTabs ?
            "OnlyTabsAllowedForIndentation" : "OnlySpacesAllowedForIndentation" );
        }
      });
    },
    /**
    * Sniff a given range
    *
    * @param {number} line
    * @param {number} pos
    * @param {number} actual
    * @param {string} errorCode
    */
    sniff: function( line, pos, actual, errorCode ) {

        mediator.publish( "violation", NAME, errorCode, [ pos, pos + actual ], {
          start: {
            line: line,
            column: 0
          },
          end: {
            line: line,
            column: actual
          }
        });
    }
  };
};

  return Sniff;
});