var AbstractIdiomatic = require('./AbstractIdiomatic'),
    util = require("../lib/Util"),
    Logger = require('../lib/Logger'),
    IdiomaticStandard = function() {
        this.logger = new Logger();
        this.extendExceptionMap({
            tooManyVarStatements: "Only one variable statement per scope allowed",
            invalidVarStatementPos: "Variable statements should always be in the beginning of their respective scope",
            invalidCommaPunctuatorSpacing: "Comma must be followed by exact one whitespace",
            invalidSingleArgumentSpacing: "There must be one whitespace around argument or no space when it is function expression or object/array/string literal",
            invalidArgumentListSpacing: "There must be one whitespace around argument list or no space when it is function expression or object/array literal",
            invalidInnerGroupingParenSpacing: "There must be no spaces around expression of inner grouping parens",
            invalidGroupingParenSpacing: "There must be one space around expression of outer grouping parens"
        });
    },
    members = {
        sniffVarStatementPerScopeRule: function( tokens ) {
            var current = tokens.current(),
                fetch;
            if ( tokens.key() === 0 ||
                ( current.match("Keyword", [ "function" ]) && current.scope ) ) {
                fetch = current.scope.asArray().filter(function( token ){
                    return token.match( "Keyword", [ "var" ] );
                });
                fetch.length > 1 && this.log( current, "tooManyVarStatements" );
                if ( fetch.length === 1 && !current.scope.current().match("Keyword", [ "var" ])) {
                    this.log( current, "invalidVarStatementPos" );
                }
            }
        },
        /**
         * Sniff at grouping parens for liberal spacing
         * If grouping parens are inner, there must be no spaces wrapping
         * the expression
         * If grouping parens are outter, there must be one space around the
         * expression
         *
         * @param TokenizerIterator tokens
         * @return void
         */
        sniffGroupingParenSpacingRule: function( tokens ) {
            var current = tokens.current(),
                prev = tokens.get( -1 ),
                first,
                last;
            if ( prev && prev.match("Identifier") ) {
                return; // @see sniffArgumentSpacing
            }
            if ( current.match("Punctuator", [ "(" ]) && current.group ) {
                first = current.group.getFirst();
                last = current.group.getLast();

                // Inner grouping parens
                if ( current.parent !== null ) {
                    ( first.before.whitespaceNum === 0 || first.before.newlineNum ) ||
                        this.log( first, "invalidInnerGroupingParenSpacing" );
                    ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                        this.log( last, "invalidInnerGroupingParenSpacing" );
                } else {
                    ( first.before.whitespaceNum === 1 || first.before.newlineNum ) ||
                        this.log( first, "invalidGroupingParenSpacing" );
                    ( last.after.whitespaceNum === 1 || last.after.newlineNum ) ||
                        this.log( last, "invalidGroupingParenSpacing" );
                }
            }
        },
        /**
         * Sniff at function arguments for
         * liberal spacing
         *
         * @param TokenizerIterator tokens
         * @return void
         */
        sniffArgumentSpacing: function( tokens ) {
            var current = tokens.current(),
                next = tokens.get( 1 ),
                fetch,
                validate = (function( that ) {
                    return {

                       /**
                        * If the argument is function expression or object/array
                        * literal or string literal no spaces allowed
                        * P.S. Line breaks allowed
                        * @param TokenizerIterator group
                        * @return boolean
                        */
                        singleArgumentLeadingSpaces: function( tokens ) {

                            var first = tokens.getFirst();
                            if ( first.match("Keyword", [ "function" ]) ||
                                first.match("Punctuator", [ "{", "[" ]) ||
                                first.match([ "String"]) ) {
                                ( first.before.whitespaceNum === 0 || first.before.newlineNum ) ||
                                    that.log( first, "invalidSingleArgumentSpacing" );
                            } else {
                                this.argumentListLeadingSpaces( tokens );
                            }
                        },
                       /**
                        * If the argument is function expression or object/array
                        * literal or string literal no spaces allowed
                        * P.S. Line breaks allowed
                        * @param TokenizerIterator group
                        * @return boolean
                        */
                        singleArgumentTraillingSpaces: function( tokens ) {
                            var first = tokens.getFirst(),
                                last = tokens.getLast();

                            if ( first.match("Keyword", [ "function" ]) ||
                                last.match("Punctuator", [ "}", "]" ]) ||
                                last.match([ "String"])) {
                                ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                                    that.log( last, "invalidSingleArgumentSpacing" );
                            } else {
                                this.argumentListTraillingSpaces( tokens );
                            }
                        },
                        /**
                         * If the argument is function expression or object/array
                         * literal no spaces allowed
                         * P.S. Line breaks allowed
                         * @param TokenizerIterator group
                         * @return boolean
                         */
                        argumentListTraillingSpaces: function( tokens ) {
                            var first = tokens.getFirst(),
                                last = tokens.getLast();
                            if ( first.match("Punctuator", [ "{", "[" ]) ||
                                 last.match("Punctuator", [ "}", "]" ]) ) {
                                ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                                    that.log( last, "invalidArgumentListSpacing" );
                            } else {
                                ( last.after.whitespaceNum === 1 || last.after.newlineNum ) ||
                                    that.log( last, "invalidArgumentListSpacing" );
                            }

                        },
                      /**
                        * If the argument is function expression or object/array
                        * literal no spaces allowed
                        * P.S. Line breaks allowed
                        * @param TokenizerIterator group
                        * @return boolean
                        */
                        argumentListLeadingSpaces: function( tokens ) {
                            var first = tokens.getFirst(),
                                last = tokens.getLast();
                            if ( first.match("Punctuator", [ "{", "[" ]) ||
                                 last.match("Punctuator", [ "}", "]" ]) ) {
                                ( first.before.whitespaceNum === 0 || first.before.newlineNum ) ||
                                    that.log( last, "invalidArgumentListSpacing" );
                            } else {
                                ( first.before.whitespaceNum === 1 || first.before.newlineNum ) ||
                                    that.log( last, "invalidArgumentListSpacing" );
                            }
                        }

                    }
                }( this ));

            if ( current.match("Identifier") && next && next.group ) {
                fetch = next.group.asArray().filter(function( token ){
                    return token.match( "Punctuator", [ "," ] );
                });
                // One argument
                if ( fetch.length === 0 ) {
                    validate.singleArgumentLeadingSpaces( next.group );
                    validate.singleArgumentTraillingSpaces( next.group );
                } else {
                    validate.argumentListLeadingSpaces( next.group );
                    validate.argumentListTraillingSpaces( next.group );
                }
                // Check comma punctuators. One space or line break expected
                fetch.length && fetch.forEach(function( token ){
                    ( token.after.whitespaceNum === 1 || token.after.newlineNum ) ||
                        this.log( token, "invalidCommaPunctuatorSpacing" );
                });

            }
        }
    };


IdiomaticStandard.prototype = new AbstractIdiomatic();
util.extend( IdiomaticStandard.prototype, members );
module.exports = IdiomaticStandard;