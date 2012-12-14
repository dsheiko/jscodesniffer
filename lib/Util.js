var util = {
    /**
     * Replica of jQuery extend method
     *
     * @param object/array receiver
     * @param object/array obj
     * @return void
     */
    extend: function( receiver, obj ) {
        Object.keys( obj ).forEach(function( prop ){
            receiver[ prop ] = obj[ prop ];
        });
    },
    /**
     * Simplified implementation of PHP sprintf.
     * It works only with %(n)s search pattern
     *
     * @param string template
     * @param mixed arg N
     * @return string
     */
    sprintf: function() {
        var re = /%\d*s/gm,
            args = Array.prototype.slice.apply( arguments ),
            tpl = args.shift(),
            matches = tpl.match( re ),
            repeatStr = function( str, repNum ) {
                var out = '', i = 1;
                for ( ; i <= repNum; i++ ) {
                    out += str;
                }
                return out;
            };

        if ( !matches ) {
            return tpl;
        }
        if ( args.length < matches.length ) {
            throw new Error( "Too few arguments" );
        }

        matches.forEach(function( match ){
            var repNum = match.replace( /\D/g, "" ),
                val = args.shift() + "";
            tpl = tpl.replace( /%\d*s/m,  repeatStr(" ", repNum - val.length) + val );
        });

        return tpl;
    },
    wordwrap: function( str, width ) {
        var words = str.split( " " ),
            i = 0, lines = [];

        width = width || 64;
        words.forEach(function( w ){
            if ( typeof lines[ i ] === "undefined" ) {
                lines[ i ] = "";
            }
            if ( lines[ i ].length < width ) {
                lines[ i ] += w + " ";
            } else {
                i++;
            }
        });
        return lines.join( "\n" );
    }
}


module.exports = util;