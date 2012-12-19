var AbstractIdiomatic = require('./AbstractIdiomatic'),
    util = require("../lib/Util"),
    Logger = require('../lib/Logger'),
    JqueryStandard = function() {
        this.logger = new Logger();
        this.extendExceptionMap({
            invalidSingleArgumentExceptionLeadingSpacing: "There must be no leading whitespace for single argument such as function expression or object/array/string literal",
            invalidSingleArgumentExceptionTraillingSpacing: "There must be no trailing whitespace for single argument such as function expression or object/array/string literal",
            invalidArgumentListLeadingSpacing: "There must be one leading whitespace for the argument list",
            invalidArgumentListTraillingSpacing: "There must be one trailing whitespace for the argument list",
            invalidArgumentListTraillingExceptionSpacing: "There must be no trailing whitespaces for argument list",
            invalidInnerGroupingLeadingSpacing: "There must be one or no leading spaces for the expression of inner grouping parens",
            invalidInnerGroupingTraillingSpacing: "There must be one or no trailling spaces for the expression of inner grouping parens"
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
                        that.log( last, "invalidInnerGroupingTraillingSpacing" );
                    
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
                        that.log( last, "invalidSingleArgumentExceptionTraillingSpacing" );
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
                        that.log( last, "invalidArgumentListTraillingExceptionSpacing" );
                    } else {
                        ( last.after.whitespaceNum === 1 || last.after.newlineNum ) ||
                        that.log( last, "invalidArgumentListTraillingSpacing" );
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
                    validate.singleArgumentTraillingSpaces( next.group );
                } else {
                    validate.argumentListLeadingSpaces( next.group );
                    validate.argumentListTraillingSpaces( next.group );
                }
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