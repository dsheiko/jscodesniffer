/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 *
 * Iterator is the main actor object through the application. Sniffer traverses tokens sequence till the stop condition.
 * In order to find out surroundings of the current tokens the API provides following navigation methods:
 *
 * instance.current() - the same as instance.get(0)
 * instance.get(N positive value) - next N's token
 * instance.get(N negative value) - prev N's token
 *
 * To see if the token matches given conditions:
 *
 * instance.match("String") - is a token of the type "String"
 * instance.match("Keyword", [ "var", "const" ]) - is a token of the type "Keyword" with value "var" or "const"
 *
 *
 */
var TokenizerIterator = function( tokens ) {
        var pos = 0;
         /**
         * Iterator interface
         */
        this.valid = function(){
            return typeof tokens[ pos ] !== "undefined";
        };
        this.next = function(){
            pos++;
        };
        this.key = function(){
            return pos;
        };
        this.rewind = function() {
            pos = 0;
        };
        this.current = function() {
            return tokens[ pos ];
        };

        /**
         * ArrayAccess interface
         */
        this.offsetSet = function( offset ) {
            pos = offset;
        };

        /**
         * @param int offset (can be negative)
         * @return object
         */
        this.get = function( offset ) {
            return tokens[ pos + offset ];
        };
        this.getLast = function() {
            return tokens[ tokens.length - 1 ];
        };
        this.getFirst = function() {
            return tokens[ 0 ];
        };

        /**
         * TokenizerIterator interface
         */

        /**
         * Replica of next, but with a filter
         * @param string type
         * @param array type
         * @return boolean
         */
        this.nextMatch = function( type, values ) {
            var i = pos,
                len = tokens.length;
            for ( ; i < len; i++ ) {
                if ( tokens[ i ].match(type, values) ) {
                    pos = i;
                    return true;
                }
            }
            return false;
        };

        this.trace = function() {
            var trace = {};
            tokens && tokens.forEach(function( token, i ){
                var vo = {};
                Object.keys( token ).forEach(function( prop ){
                    if ( token[ prop ] instanceof TokenizerIterator ) {
                        vo[ prop ] = token[ prop ].trace();
                    } else {
                        typeof token[ prop ] !== "function" &&
                            ( vo[ prop ] = token[ prop ] );
                    }
                });
                trace[ i ] = vo;
            });
            return trace;
        };
        /**
         * tokens.matchValues( "Punctuator", [ "<", "<", "=" ] )
         *
         * @param string type
         * @param array type
         * @return boolean
         */
        this.matchValueSequence = function( type, values ) {
            return values.every( function( val, inx ){
                return this.get( inx ).match( type, val );
            }, this );
        };

        this.asArray = function() {
            return tokens;
        };

        this.clone = function() {
            var it = new TokenizerIterator( tokens );
            it.offsetSet( pos );
            return it;
        };
    };

module.exports = TokenizerIterator;