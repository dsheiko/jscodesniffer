/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var util = require("./Util"),
    Reporter = require("./Reporter"),
    Logger = function() {
        var messages = [];
        return {
            log: function( msg, code, line, pos ) {
                if (typeof msg !== "string") {
                    msg = util.sprintf( msg[ 0 ], msg[ 1 ] );
                }
                messages.push({
                    message: msg,
                    code: code,
                    line: line,
                    column: pos
                })
            },
            getMessages: function() {
                return messages;
            },
            hasMessage: function( code ) {
                return messages.some(function( msg ){
                    return msg.code === code;
                });
            },
            isEmpty: function() {
                return !( !!messages.length );
            },
            trace: function() {
                return messages ? messages.map(function( msg ){
                    return msg.code;
                }).join(",") : "<empty>";
            },
            report: function( path, format ) {
                var reporter = new Reporter( messages ),
                    method = format || "full";
                return reporter[ method ]( path );
            }
        }
    };

module.exports = Logger;