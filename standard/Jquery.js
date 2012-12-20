/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var AbstractIdiomatic = require('./AbstractIdiomatic'),
    util = require("../lib/Util"),
    Logger = require('../lib/Logger'),
    JqueryStandard = function() {
        this.logger = new Logger();
        this.extendExceptionMap({
            "Jquery.invalidCommaPunctuatorSpacing": "Coma punctuator shall have single traling space or line break",
            "Jquery.invalidSingleArgumentExceptionLeadingSpacing": "There must be no leading whitespace for single argument such as function expression or object/array/string literal",
            "Jquery.invalidSingleArgumentExceptionTrailingSpacing": "There must be no trailing whitespace for single argument such as function expression or object/array/string literal",
            "Jquery.invalidSingleArgumentLeadingSpacing": "There must be one leading whitespace for the argument",
            "Jquery.invalidSingleArgumentTrailingSpacing": "There must be one trailing whitespace for the argument",
            "Jquery.invalidSingleArgumentTrailingExceptionSpacing": "There must be no trailing whitespaces for the argument",
            "Jquery.invalidArgumentListLeadingSpacing": "There must be one leading whitespace for the argument list",
            "Jquery.invalidArgumentListTrailingSpacing": "There must be one trailing whitespace for the argument list",
            "Jquery.invalidArgumentListTrailingExceptionSpacing": "Multi-line function/object/array literals go snug at end",
            "Jquery.invalidInnerGroupingLeadingSpacing": "There must be one or no leading spaces for the expression of inner grouping parens",
            "Jquery.invalidInnerGroupingTrailingSpacing": "There must be one or no trailing spaces for the expression of inner grouping parens"
        });
    };

members = {

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
                * If inside other function call, no spaces wrapping the expression allowed
                * otherwise grouping parens must have one padding space
                *
                * @param TokenizerIterator tokens
                * @return void
                */
                innerGroupingSpacing: function( tokens ) {
                    var first = tokens.getFirst(),
                        last = tokens.getLast();

                    ( first.before.whitespaceNum < 2 || first.before.newlineNum ) ||
                        that.log( first, "Jquery.invalidInnerGroupingLeadingSpacing" );
                    ( last.after.whitespaceNum < 2 || last.after.newlineNum ) ||
                        that.log( last, "Jquery.invalidInnerGroupingTrailingSpacing" );

                },

               /**
                * Functions, object literals, array literals and string literals
                * go snug to front and back of the parentheses - but ONLY
                * when it's the only argument
                * P.S. Line breaks allowed
                * @param TokenizerIterator group
                * @return boolean
                */
                singleArgumentLeadingSpaces: function( tokens ) {
                    var first = tokens.getFirst(),
                        second = tokens.get( 1 ),
                        validateException = function() {
                            ( first.before.whitespaceNum === 0 || first.before.newlineNum ) ||
                                that.log( first, "Jquery.invalidSingleArgumentExceptionLeadingSpacing" );
                        },
                        validateRegular = function() {
                            ( first.before.whitespaceNum === 1 || first.before.newlineNum ) ||
                                that.log( first, "Jquery.invalidSingleArgumentLeadingSpacing" );
                        };

                    // If the second token is an operator. E.g. foo( "ex" + 1 )
                    if ( second && second.match("Punctuator", [ "+", "-" ])) {
                        validateRegular();
                    } else if ( first.match("Keyword", [ "function" ]) ||
                        first.match("Punctuator", [ "{", "[" ]) ||
                        first.match([ "String" ]) ) {
                        validateException();
                    } else {
                        validateRegular();
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
                singleArgumentTrailingSpaces: function( tokens ) {
                    var first = tokens.getFirst(),
                        last = tokens.getLast(),
                        second = tokens.get( 1 ),
                        validateException = function() {
                            ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                                that.log( last, "Jquery.invalidSingleArgumentExceptionTrailingSpacing" );
                        },
                        validateRegular = function() {
                            if ( last.match("Punctuator", [ "}", "]" ])) {
                                ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                                that.log( last, "Jquery.invalidSingleArgumentTrailingExceptionSpacing" );
                            } else {
                                ( last.after.whitespaceNum === 1 || last.after.newlineNum ) ||
                                that.log( last, "Jquery.invalidSingleArgumentTrailingSpacing" );
                            }
                        };

                    // If the second token is an operator. E.g. foo( "ex" + 1 )
                    if ( second && second.match("Punctuator", [ "+", "-" ])) {
                        validateRegular();
                    } else if ( first.match("Keyword", [ "function" ]) ||
                        last.match("Punctuator", [ "}", "]" ]) ||
                        last.match([ "String" ])) {
                        validateException();
                    } else {
                        validateRegular();
                    }
                },
               /**
                * Multi-line function/object/array literals go snug at end.
                * In other cases there must be one whitespace following argument list
                * P.S. Line breaks allowed
                * @param TokenizerIterator group
                * @return boolean
                */
                argumentListTrailingSpaces: function( tokens ) {
                    var first = tokens.getFirst(),
                        last = tokens.getLast();
                    if ( first.line < last.line ) {
                        ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                        that.log( last, "Jquery.invalidArgumentListTrailingExceptionSpacing" );
                    } else {
                        ( last.after.whitespaceNum === 1 || last.after.newlineNum ) ||
                        that.log( last, "Jquery.invalidArgumentListTrailingSpacing" );
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
                    that.log( first, "Jquery.invalidArgumentListLeadingSpacing" );
                }

            }
        }( this ));

        if ( ( current.match("Identifier") || current.match("Keyword", [ "function" ]) ) &&
            next && next.group ) {
            fetch = next.group.asArray().filter(function( token ){
                return token.match( "Punctuator", [ "," ]);
            });
            if ( next.parent !== null ) {
                validate.innerGroupingSpacing( next.group );
            } else {
                if ( fetch.length === 0 ) {
                    validate.singleArgumentLeadingSpaces( next.group );
                    validate.singleArgumentTrailingSpaces( next.group );
                } else {
                    validate.argumentListLeadingSpaces( next.group );
                    validate.argumentListTrailingSpaces( next.group );
                }
            }
            // Check comma punctuators. One space or line break expected
            fetch.length && fetch.forEach( function( token ){
                ( token.after.whitespaceNum === 1 || token.after.newlineNum ) ||
                this.log( token, "Jquery.invalidCommaPunctuatorSpacing" );
            }, this );

        }
    }

};


JqueryStandard.prototype = new AbstractIdiomatic();
util.extend( JqueryStandard.prototype, members );
module.exports = JqueryStandard;