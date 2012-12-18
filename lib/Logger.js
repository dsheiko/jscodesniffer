var util = require("./Util"),

Logger = function() {
    var messages = [];
    return {
        log: function( msg, code, line, pos ) {
            if (typeof msg !== "string") {
                msg = util.sprintf( msg[0], msg[1] );
            }
            messages.push({
                message: msg,
                code: code,
                line: line,
                position: pos
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
            return messages ? messages.map(function( msg ){ return msg.code; }).join( "," ) : "<empty>";
        },
        report: function() {
            var header = "------------------------------------------------------------------------------\n" +
                        " FOUND " + messages.length + " ERROR(S)\n" +
                        "+------------------------------------------------------------------------------\n" +
                        " LINE  | POSITION | MESSAGE \n" +
                        "+------------------------------------------------------------------------------\n",
                footer = "------------------------------------------------------------------------------\n",
                out = '';
            if ( messages.length ) {
                out += ( header )
                messages.forEach(function( log ){
                    var message = util.wordwrap( log.message );
                    message = message.split( "\n" ).join( "\n       |         | " );
                    out += ( " " + util.sprintf("%5s", log.line) +
                        " | " + util.sprintf("%7s", log.position) +
                        " | " +  message + "\n" );
                });
                out += ( footer );
            }
            return out;
        }
    }
};

module.exports = Logger;