/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var Token = function( data ) {
        Object.keys( data ).forEach( function( prop ){
            data.hasOwnProperty( prop ) && ( this[ prop ] = data[ prop ] );
        }, this );
        this.scope = null;
        this.group = null;
        this.parent = null;
        /**
        * @param array/string type
        * @param array arrOfValues OPTIONAL
        */
        this.match = function( type, arrOfValues ) {
            if ( Array.isArray( type ) ) {
                return type.indexOf( this.type ) !== -1;
            } else if ( typeof arrOfValues === "undefined" ) {
                return this.type === type;
            } else {
                return this.type === type && arrOfValues.indexOf( this.value ) !== -1;
            }
        };
        this.clone = function() {
            return new Token( this );
        };
    };

module.exports = Token;