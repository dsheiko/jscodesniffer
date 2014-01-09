/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var util = {
     BEAUTIFY: true,
     CONSOLE_COLORS: {
        "black": '0;30',
        "dark gray": '1;30',
        "blue": '0;34',
        "light blue": '1;34',
        "green": '0;32',
        "light green": '1;32',
        "cyan": '0;36',
        "light cyan": '1;36',
        "red": '0;31',
        "light red": '1;31',
        "purple": '0;35',
        "light purple": '1;35',
        "brown": '0;33',
        "yellow": '1;33',
        "light gray": '0;37',
        "white": '1;37'
     },
     CONSOLE_RESET_COLOR: "\033[0m",
     /**
      * Colorize the given string outside Reporter
      * @param string color
      * @param string srt
      * @return string
      */
     color: function( color, str ) {
         return util.CONSOLE_COLORS[ color ] ?
             "\033[" + util.CONSOLE_COLORS[ color ] + "m" + str +
             util.CONSOLE_RESET_COLOR : str;
     },

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
     * Replica of PHP str_repeat
     */
    repeatStr: function( str, repNum ) {
        var out = '', i = 1;
        for ( ; i <= repNum; i++ ) {
            out += str;
        }
        return out;
    },
    /**
     * Simplified replica of PHP sprintf.
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
            matches = tpl.match( re );

        if ( !matches ) {
            return tpl;
        }
        if ( args.length < matches.length ) {
            throw new Error("Too few arguments");
        }

        matches.forEach(function( match ){
            var repNum = match.replace( /\D/g, "" ),
                val = args.shift() + "";
            tpl = tpl.replace( /%\d*s/m, val + util.repeatStr(" ", repNum - val.length) );
        });

        return tpl;
    },
    /**
     * Simplified replica of PHP wordwrap
     *
     * @param string tr
     * @param int width
     * @return string
     */
    wordwrap: function( str, width ) {
        var MIN_WRAP_WIDTH = 62,
            words = str.split(" "),
            i = 0,
            lines = [],
            getPlainText = function( markdown ) {
                return markdown.replace( /(\[.*?\])/gm, "" );
            };

        width = width || MIN_WRAP_WIDTH;
        words.forEach(function( w ){
            if ( typeof lines[ i ] === "undefined" ) {
                lines[ i ] = "";
            }
            if ( getPlainText(lines[ i ] + w).length <= width ) {
                lines[ i ] += w + " ";
            } else {
                lines[ ++i ] = w + " ";
            }
        });

        return lines.join("\n");
    },
    /**
     * Replica of PHP var_dump()
     * Heavily based on http://www.openjs.com/scripts/others/dump_function_php_print_r.php
     *
     * @param mixed data
     * @param int level
     * @return string
     */
    vardump: function ( data, level ) {
  var dumpText = "",
            levelPadding = "",
            j = 0,
            prop,
            value;

  level = level || 0;

  for ( ; j < level + 1; j++ ) {
            levelPadding += "    ";
        }
  if ( typeof( data ) === 'object' ) { //Array/Hashes/Objects

            for ( prop in data ) {

                if ( data.hasOwnProperty(prop) ) {
                    value = data[ prop ];
                    if ( typeof( value ) === 'object' && value !== null ) {
                        dumpText += levelPadding +
                            ( level ?
                                ( prop + " ..." ) :
                                util.color( "light green", prop + " ..." )
                            ) + "\n";
                        dumpText += util.vardump( value, level + 1 );
                    } else {
                        if ( typeof value === "string" ) {
                            value = util.color( "yellow", "\"" + value + "\"" );
                        } else if ( value === null ) {
                            value = util.color( "light blue", value );
                        }
                        dumpText += levelPadding + "" + prop + ": " + value + "\n";
                    }
                }
            }
  } else { //Stings/Chars/Numbers etc.
            dumpText = "===>" + data + "<===(" + typeof( data ) + ")";
  }
  return dumpText;
    }

};


module.exports = util;