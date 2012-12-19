/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var esprima = require("esprima"),
    tokenizer = require('./Tokenizer'),
    util = require('./Util'),
    
    sniffer = (function() {
        var logger,
            Standard;
        return {
            trace: function( data, standardConstr ) {
                Standard = standardConstr;
                return util.vardump( tokenizer.parse(data).trace() );
            },
            run: function( data, standardConstr ) {
                Standard = standardConstr;
                logger = this.analyzeTokens( tokenizer.parse(data) );
                return logger;
            },

            /**
             * @param TokenizerIterator tokens
             * @return void
             */
            analyzeTokens : function( tokens ) {
                var rule, standard = new Standard();
                tokens.rewind();
                while( tokens.valid() ) {
                    for ( rule in standard ) {
                        rule.indexOf( "sniff" ) === 0 &&
                            standard[ rule ]( tokens.clone() );
                    }
                    tokens.next();
                }
                return standard.logger;
            }
        }
    }());



module.exports = sniffer;