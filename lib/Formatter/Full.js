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
  return function( config ) {
    var utils = require( "../Utils" );
    return {
      /**
       * @return {string}
       */
      header: function() {
        return '';
      },
      /**
       * @return {string}
       */
      report: function( path, messages, standard ) {
        var hrPlain = utils.repeatStr( "-", config.reportWidth ) + "\n",
            hrStarred = "+" + utils.repeatStr( "-", config.reportWidth - 1 ) + "\n",
            header = "\n [color:light red]FILE: " + path + " violates " + standard + " standard [/color]\n" +
              hrPlain +
               " FOUND " + messages.length + " ERROR(S)\n" +
               hrStarred +
               " LINE  | COLUMN   | MESSAGE \n" +
               hrStarred,
            footer = hrPlain + "\n",
            out = '';
        if ( !messages.length ) {
          return '';
        }
        out += ( header );
        messages.forEach(function( log ){
          var message = utils.wordwrap( "[color:dark gray]" +  log.sniff + ":[/color] " +
            log.message, config.reportWidth - 20 );
          message = message.split("\n").join("\n       |          | ");

          out += ( " " + utils.sprintf("%5s", log.loc.start.line) +
              " | " + utils.sprintf("%8s", log.loc.start.column) +
              " | " + message + "\n" );
        });
        out += ( footer );
        return out;
      },
      /**
       * @return {string}
       */
      footer: function() {
        return '';
      }
    };
  };
});