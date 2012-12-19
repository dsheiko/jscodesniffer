var AbstractIdiomatic = require('./AbstractIdiomatic'),
    util = require("../lib/Util"),
    Logger = require('../lib/Logger'),
    JqueryStandard = function() {
        this.logger = new Logger();
        this.extendExceptionMap({
            invalidCommaPunctuatorSpacing: "Coma punctuator shall have single traling space or line break",
            invalidSingleArgumentExceptionLeadingSpacing: "There must be no leading whitespace for single argument such as function expression or object/array/string literal",
            invalidSingleArgumentExceptionTrailingSpacing: "There must be no trailing whitespace for single argument such as function expression or object/array/string literal",
            invalidSingleArgumentLeadingSpacing: "There must be one leading whitespace for the argument",
            invalidSingleArgumentTrailingSpacing: "There must be one trailing whitespace for the argument",
            invalidSingleArgumentTrailingExceptionSpacing: "There must be no trailing whitespaces for the argument",
            invalidArgumentListLeadingSpacing: "There must be one leading whitespace for the argument list",
            invalidArgumentListTrailingSpacing: "There must be one trailing whitespace for the argument list",
            invalidArgumentListTrailingExceptionSpacing: "There must be no trailing whitespaces for argument list",
            invalidInnerGroupingLeadingSpacing: "There must be one or no leading spaces for the expression of inner grouping parens",
            invalidInnerGroupingTrailingSpacing: "There must be one or no trailing spaces for the expression of inner grouping parens"
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
                        that.log( first, "invalidInnerGroupingLeadingSpacing" );
                    ( last.after.whitespaceNum < 2 || last.after.newlineNum ) ||
                        that.log( last, "invalidInnerGroupingTrailingSpacing" );

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
                    var first = tokens.getFirst();
                    if ( first.match("Keyword", [ "function" ]) ||
                        first.match("Punctuator", [ "{", "[" ]) ||
                        first.match([ "String"]) ) {
                        ( first.before.whitespaceNum === 0 || first.before.newlineNum ) ||
                        that.log( first, "invalidSingleArgumentExceptionLeadingSpacing" );
                    } else {
                        ( first.before.whitespaceNum === 1 || first.before.newlineNum ) ||
                        that.log( first, "invalidSingleArgumentLeadingSpacing" );
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
                    last = tokens.getLast();

                    if ( first.match("Keyword", [ "function" ]) ||
                        last.match("Punctuator", [ "}", "]" ]) ||
                        last.match([ "Numeric", "String"])) {
                        ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                        that.log( last, "invalidSingleArgumentExceptionTrailingSpacing" );
                    } else {
                        if ( last.match("Punctuator", [ "}", "]" ])) {
                            ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                            that.log( last, "invalidSingleArgumentTrailingExceptionSpacing" );
                        } else {
                            ( last.after.whitespaceNum === 1 || last.after.newlineNum ) ||
                            that.log( last, "invalidSingleArgumentTrailingSpacing" );
                        }
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
                    var last = tokens.getLast();
                    if ( last.match("Punctuator", [ "}", "]" ])) {
                        ( last.after.whitespaceNum === 0 || last.after.newlineNum ) ||
                        that.log( last, "invalidArgumentListTrailingExceptionSpacing" );
                    } else {
                        ( last.after.whitespaceNum === 1 || last.after.newlineNum ) ||
                        that.log( last, "invalidArgumentListTrailingSpacing" );
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
                    that.log( first, "invalidArgumentListLeadingSpacing" );
                }

            }
        }( this ));

        if ( ( current.match("Identifier") || current.match("Keyword", ["function"]) ) &&
            next && next.group ) {
            fetch = next.group.asArray().filter(function( token ){
                return token.match( "Punctuator", [ "," ] );
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
            fetch.length && fetch.forEach(function( token ){
                ( token.after.whitespaceNum === 1 || token.after.newlineNum ) ||
                this.log( token, "invalidCommaPunctuatorSpacing" );
            }, this);

        }
    }

};


JqueryStandard.prototype = new AbstractIdiomatic();
util.extend( JqueryStandard.prototype, members );
module.exports = JqueryStandard;