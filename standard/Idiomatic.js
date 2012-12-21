/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var AbstractIdiomatic = require('./AbstractIdiomatic'),
    util = require("../lib/Util"),
    Logger = require('../lib/Logger'),
    IdiomaticStandard = function() {
        this.logger = new Logger();
        this.extendExceptionMap({
            "Idiomatic.tooManyVarStatements": "Only one variable statement per scope allowed",
            "Idiomatic.invalidVarStatementPos": "Variable statements should always be in the beginning of their respective scope",
            "Idiomatic.invalidCommaPunctuatorSpacing": "Comma must be followed by exact one whitespace",
            "Idiomatic.invalidSingleArgumentExceptionLeadingSpacing": "There must be no leading whitespaces for the argument when it is function expression or object/array/string literal",
            "Idiomatic.invalidSingleArgumentLeadingSpacing": "There must be one leading whitespace for the argument",
            "Idiomatic.invalidSingleArgumentExceptionTrailingSpacing": "There must be no trailing whitespaces for the argument when it is function expression or object/array/string literal",
            "Idiomatic.invalidSingleArgumentTrailingSpacing": "There must be one trailing whitespace for the argument",
            "Idiomatic.invalidArgumentListLeadingExceptionSpacing": "There must be no leading whitespaces for the argument list when it is function expression or object/array/string literal",
            "Idiomatic.invalidArgumentListLeadingSpacing": "There must be one leading whitespace for the argument list",
            "Idiomatic.invalidArgumentListTrailingExceptionSpacing": "There must be no trailing whitespaces for the argument list when it is function expression or object/array/string literal",
            "Idiomatic.invalidArgumentListTrailingSpacing": "There must be one trailing whitespace for the argument list",
            "Idiomatic.invalidInnerGroupingLeadingSpacing": "There must be no leading spaces for expression of inner grouping parens",
            "Idiomatic.invalidInnerGroupingTrailingSpacing": "There must be no trailing spaces for expression of inner grouping parens",
            "Idiomatic.invalidOutterGroupingLeadingSpacing": "There must be single leading space for expression of outter grouping parens",
            "Idiomatic.invalidOutterGroupingTrailingSpacing": "There must be single trailing space for expression of outter grouping parens"
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
                fetch.length > 1 && this.log( current, "Idiomatic.tooManyVarStatements" );
                if ( fetch.length === 1 && !current.scope.current().match("Keyword", [ "var" ])) {
                    this.log( current, "Idiomatic.invalidVarStatementPos" );
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
            if ( prev && (prev.match("Identifier") ||
                    prev.match("Keyword", [ "function" ])) ) {
                return; // @see sniffArgumentSpacing
            }
            if ( current.match("Punctuator", [ "(" ]) && current.group ) {
                first = current.group.getFirst();
                last = current.group.getLast();

                // Inner grouping parens
                if ( current.parent !== null ) {
                    ( first.before.whitespaceNum === 0 || first.before.newlineNum ) ||
                        this.log( first, "Idiomatic.invalidInnerGroupingLeadingSpacing" );
                    ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                        this.log( last, "Idiomatic.invalidInnerGroupingTrailingSpacing" );
                }
                // if/else/for/while/try always have spaces, braces and span multiple lines
                // this encourages readability
                if ( current.parent === null &&
                    prev.match("Keyword", [ "if", "else", "for", "while", "try" ]) ) {

                    ( first.before.whitespaceNum === 1 || first.before.newlineNum ) ||
                        this.log( first, "Idiomatic.invalidOutterGroupingLeadingSpacing" );
                    ( last.after.whitespaceNum === 1 || last.after.newlineNum ) ||
                        this.log( last, "Idiomatic.invalidOutterGroupingTrailingSpacing" );

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
                                first.match([ "String" ]) ) {
                                ( first.before.whitespaceNum === 0 || first.before.newlineNum ) ||
                                    that.log( first, "Idiomatic.invalidSingleArgumentExceptionLeadingSpacing" );
                            } else {
                                ( first.before.whitespaceNum === 1 || first.before.newlineNum ) ||
                                    that.log( first, "Idiomatic.invalidSingleArgumentLeadingSpacing" );
                            }
                        },
                       /**
                        * If the argument is function expression or object/array
                        * literal or string literal no spaces allowed
                        * P.S. Line breaks allowed
                        * @param TokenizerIterator group
                        * @return boolean
                        */
                        singleArgumentTrailingSpaces: function( tokens ) {
                            var first = tokens.getFirst(),
                                last = tokens.getLast();

                            if ( first.match("Keyword", [ "function" ]) ||
                                last.match("Punctuator", [ "}", "]" ]) ||
                                last.match([ "String" ])) {
                                ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                                    that.log( last, "Idiomatic.invalidSingleArgumentExceptionTrailingSpacing" );
                            } else {
                                ( last.after.whitespaceNum === 1 || last.after.newlineNum ) ||
                                    that.log( last, "Idiomatic.invalidSingleArgumentTrailingSpacing" );
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
                            var first = tokens.getFirst();
                            if ( first.match("Punctuator", [ "{", "[" ]) ) {
                                ( first.before.whitespaceNum === 0 || first.before.newlineNum ) ||
                                    that.log( first, "Idiomatic.invalidArgumentListLeadingExceptionSpacing" );
                            } else {
                                ( first.before.whitespaceNum === 1 || first.before.newlineNum ) ||
                                    that.log( first, "Idiomatic.invalidArgumentListLeadingSpacing" );
                            }
                        },
                        /**
                         * If the argument is function expression or object/array
                         * literal no spaces allowed
                         * P.S. Line breaks allowed
                         * @param TokenizerIterator group
                         * @return boolean
                         */
                        argumentListTrailingSpaces: function( tokens ) {
                            var first = tokens.getFirst(),
                                last = tokens.getLast();
                            if ( first.match("Punctuator", [ "{", "[" ]) ||
                                 last.match("Punctuator", [ "}", "]" ]) ) {
                                ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                                    that.log( last, "Idiomatic.invalidArgumentListTrailingExceptionSpacing" );
                            } else {
                                ( last.after.whitespaceNum === 1 || last.after.newlineNum ) ||
                                    that.log( last, "Idiomatic.invalidArgumentListTrailingSpacing" );
                            }

                        }


                    };
                }( this ));

            if ( current.match("Identifier") && next && next.group ) {
                fetch = next.group.asArray().filter(function( token ){
                    return token.match( "Punctuator", [ "," ] );
                });
                // One argument
                if ( fetch.length === 0 ) {
                    validate.singleArgumentLeadingSpaces( next.group );
                    validate.singleArgumentTrailingSpaces( next.group );
                } else {
                    validate.argumentListLeadingSpaces( next.group );
                    validate.argumentListTrailingSpaces( next.group );
                }
                // Check comma punctuators. One space or line break expected
                fetch.length && fetch.forEach(function( token ){
                    ( token.after.whitespaceNum === 1 || token.after.newlineNum ) ||
                        this.log( token, "Idiomatic.invalidCommaPunctuatorSpacing" );
                });

            }
        }
    };


IdiomaticStandard.prototype = new AbstractIdiomatic();
util.extend( IdiomaticStandard.prototype, members );
module.exports = IdiomaticStandard;