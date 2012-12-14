var esprima = require("esprima"),
    tokenizer = require('./Tokenizer');

var sniffer = (function() {
        var logger,
            Standard;
        return {

            run: function( data, standardConstr ) {
                Standard = standardConstr;
                logger = this.analyzeTokens( tokenizer.parse( data ) );
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