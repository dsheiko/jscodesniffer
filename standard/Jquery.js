var AbstractIdiomatic = require('./AbstractIdiomatic'),
	util = require("../lib/Util"),
	Logger = require('../lib/Logger'),
    JqueryStandard = function() {
        this.logger = new Logger();
        this.extendExceptionMap({
            invalidSingleArgumentSpacing: "There must be one whitespace around argument or no space when it is function expression or object/array/string literal",
            invalidArgumentListSpacing: "There must be one whitespace around argument list or no space when it is function expression or object/array literal",
            invalidInnerGroupingParenSpacing: "There must be no spaces around expression of inner grouping parens",
            invalidGroupingParenSpacing: "There must be one space around expression of outer grouping parens"
        });
    };

members = {
        /**
         * If inside other function call, no spaces wrapping the expression allowed
         * otherwise grouping parens must have one padding space
         *
         * @param TokenizerIterator tokens
         * @return void
         */
        sniffGroupingParenSpacingRule: function( tokens ) {
            var current = tokens.current(),
                prev = tokens.get( -1 ),
                first,
                last;
            if ( prev && (prev.match("Keyword", [ "function" ])  ||
                    prev.match("Identifier")) &&
                    current.match("Punctuator", [ "(" ]) && current.group ) {
                first = current.group.getFirst();
                last = current.group.getLast();

                // Inner grouping parens
                if ( current.parent !== null ) {
                    ( first.before.whitespaceNum < 2 || first.before.newlineNum ) ||
                        this.log( first, "invalidInnerGroupingParenSpacing" );
                    ( last.after.whitespaceNum < 2 || last.after.newlineNum ) ||
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
                       * Functions, object literals, array literals and string literals
                       * go snug to front and back of the parentheses - but ONLY
                       * when it's the only argument
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
                                    that.log( first, "invalidArgumentListSpacing" );
                            } else {
                                this.argumentListLeadingSpaces( tokens );
                            }
                        },
                       /**
                        * Functions, object literals, array literals and string literals
                        * go snug to front and back of the parentheses - but ONLY
                        * when it's the only argument
                        * P.S. Line breaks allowed
                        * @param TokenizerIterator group
                        * @return boolean
                        */
                        singleArgumentTraillingSpaces: function( tokens ) {
                            var first = tokens.getFirst(),
                                last = tokens.getLast();

                             if ( first.match("Keyword", [ "function" ]) ||
                                last.match("Punctuator", [ "}", "]" ]) ||
                                last.match([ "Numeric", "String"])) {
                                ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                                    that.log( last, "invalidArgumentListSpacing" );
                            } else {
                                this.argumentListTraillingSpaces( tokens );
                            }
                        },
                       /**
                        * Multi-line function/object/array literals go snug at end.
                        * In other cases there must be one whitespace following argument list
                        * P.S. Line breaks allowed
                        * @param TokenizerIterator group
                        * @return boolean
                        */
                        argumentListTraillingSpaces: function( tokens ) {
                            var last = tokens.getLast();
                            if ( last.match("Punctuator", [ "}", "]" ])) {
                                ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                                    that.log( last, "invalidArgumentListSpacing" );
                            } else {
                                ( last.after.whitespaceNum === 1 || last.after.newlineNum ) ||
                                    that.log( last, "invalidArgumentListSpacing" );
                            }

                        },
                       /**
                        * Always include extra space preceding argument list
                        * P.S. Line breaks allowed
                        * @param TokenizerIterator group
                        * @return boolean
                        */
                        argumentListLeadingSpaces: function( tokens ) {
                            var first = tokens.getFirst();
                            ( first.before.whitespaceNum === 1 || first.before.newlineNum ) ||
                                that.log( first, "invalidArgumentListSpacing" );
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


JqueryStandard.prototype = new AbstractIdiomatic();
util.extend( JqueryStandard.prototype, members );
module.exports = JqueryStandard;