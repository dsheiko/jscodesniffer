/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var esprima = require("esprima"),
    tokenizer = require('./Tokenizer'),
    util = require('./Util'),

    sniffer = (function() {
        var logger;
        return {
            trace: function( data ) {
                return util.vardump( tokenizer.parse(data).trace() );
            },
            run: function( data, standardName ) {
                var tokens = tokenizer.parse( data );
                standardName = tokenizer.findJscsOptions().standard ||
                        standardName;
                logger = this.analyzeTokens( tokens , standardName );
                return logger;
            },

            /**
             * @param TokenizerIterator tokens
             * @return void
             */
            analyzeTokens : function( tokens, standardName ) {
                var rule, standard, StandardConstr;
                try {
                    StandardConstr = require( '../standard/' + standardName );
                } catch ( e ) {
                    if ( e.code !== 'MODULE_NOT_FOUND' ) {
                        throw e;
                    }
                    console.error( "Cannot find standard " + standardName );
                    process.exit( 2 );
                }
                standard = new StandardConstr();
                tokens.rewind();
                while( tokens.valid() ) {
                    for ( rule in standard ) {
                        rule.indexOf("sniff") === 0 &&
                            standard[ rule ]( tokens.clone() );
                    }
                    tokens.next();
                }
                standard.logger.standard = standardName;
                return standard.logger;
            }
        };
    }());



module.exports = sniffer;