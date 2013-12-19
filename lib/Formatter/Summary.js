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
  var utils = require( "../Utils" );
  return function( config ) {
    var fileCount = 0, errorCount = 0;
    return {
      /**
       * @return {string}
       */
      header: function() {
        var hrPlain = utils.repeatStr( "-", config.reportWidth ) + "\n";
        return "\n JS CODE SNIFFER " + config.version + " REPORT SUMMARY\n" +
            hrPlain +
            " FILE" + utils.repeatStr( " ", config.reportWidth - 12 ) + "ERRORS  \n" +
            hrPlain;
      },
      /**
       * @param {string} path
       * @param {array} messages
       * @return {string}
       */
      report: function( path, messages ) {
        if ( !messages.length ) {
            return '';
        }
        fileCount ++;
        errorCount += messages.length;
        return " " + utils.sprintf( "%" + ( config.reportWidth - 9 ) + "s", path ) + ' ' + messages.length + "\n";
      },
      /**
       * @return {string}
       */
      footer: function() {
        var hrPlain = utils.repeatStr( "-", config.reportWidth ) + "\n";
        return hrPlain +
            " A TOTAL OF " + errorCount + " ERROR(S) WERE FOUND IN " + fileCount + " FILE(S)\n" +
            hrPlain;
      }
    };
  };
});