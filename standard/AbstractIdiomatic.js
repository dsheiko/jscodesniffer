var AbstractStandard = require('./AbstractStandard'),
    util = require("../lib/Util"),
    // Custom exception
    StopIteration = StopIteration || (function(){
        var StopIteration = function( message ){
            this.name = "StopIteration";
            this.message = message || "StopIteration thrown";
        }
        StopIteration.prototype = new ReferenceError();
        StopIteration.constructor = StopIteration;
        return StopIteration;
    }()),
    AbstractIdiomatic = function() {
        this.extendExceptionMap({
            invalidOperatorPrecedingSpacing: "There must be one preceding whitespace around operator (%s)",
            invalidOperatorFollowingSpacing: "There must be one following whitespace around operator (%s)",
            invalidLiteralLeadingSpacing: "There must be one leading whitespace for the literal (%s)",
            invalidLiteralTraillingSpacing: "There must be one trailling whitespace for the literal (%s)",
            invalidIdentifierName: "Identifier (%s) must be in PascalCase when it is a constructor, otherwise in camelCase"
        });
    },
    members = {
        /**
         * Sniff for identifier naming convention violation
         * Constructors must be on PascalCase and other identifiers of camelCase
         * Neither Pascal nor CamelCase allows repeating uppercase characters
         * Both allow but only trailing digits
         *
         * @param TokenizerIterator tokens
         * @return void
         */
        sniffIdentifierNamingConvention: function( tokenizer ) {
            var current = tokenizer.current(),
                // checks for cameCase or PascalCase
                isValidIdentifierName = function( string ) {
                    var validRe = /^_?[a-zA-Z]*[0-9]*$/,
                        isConstantRe = /^[A-Z_]+[0-9]*$/,
                        noUcRepRe = /[A-Z]{2}/;

                    return isConstantRe.test( string ) ||
                        ( validRe.test( string ) && !noUcRepRe.test( string ) );
                };

            if ( current.match( "Identifier" ) ) {
                if ( !isValidIdentifierName( current.value ) ) {
                    this.log( current, "invalidIdentifierName" );
                }

            }
        },



        /**
         * Sniff at operators (Arithmetic Operators, Assignment Operators,
         * Bitwise Operators, Comparison Operators, Logical Operators) for
         * liberal spacing
         *
         * @param TokenizerIterator tokens
         * @return void
         */
        sniffOperatorSpacing: function( tokens ) {
            var current = tokens.current(),
                next = tokens.get( 1 ),
                validate = (function( that ) {
                    return {
                        spacing: function( start, end ) {
                            // If not preceded by a linebreak, must be by exact one whitespace
                            ( start.before.whitespaceNum === 1 ) ||
                                that.log( start, "invalidOperatorPrecedingSpacing" );

                            ( end.after.whitespaceNum === 1 || end.after.newlineNum ) ||
                                that.log( end, "invalidOperatorFollowingSpacing" );
                        }
                    };
                }( this ));


              if ( current.match( "Punctuator", [ ">>>=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=",
                  "&=", "^=", "|=", "!===", "!==", "!=", "===", "==", "=", "*", "/", "%" ] ) ) {
                    validate.spacing( current, current );
               }

                // Plus, but not incrementor, not unary +
                if ( current.match( "Punctuator", [ "+" ] ) && next &&
                        !next.match([ "Numeric", "String", "Identifier" ]) ) {
                    validate.spacing( current, current );
                }
                // Minus, but not decrementor, not unary -
                if ( current.match( "Punctuator", [ "-" ] ) && next &&
                        !next.match([ "Numeric", "String", "Identifier" ]) ) {
                    validate.spacing( current, current );
                }
        },

       /**
         * Sniff at primitive type literals ( Boolean, Date, Number,
         * RegExp,  String) for liberal spacing
         *
         * @param TokenizerIterator tokens
         * @return void
         */
        sniffLiteralSpacing: function( tokens ) {
            var current = tokens.current(),
                prev = tokens.get( -1 ),
                next = tokens.get( 1 );

            if ( current.match( [ "Numeric", "String", "Boolean", "Date",
                "RegularExpression", "Null" ] ) ) {
                // If not preceded by a linebreak,
                // must be by exact one whitespace
                if ( prev &&
                    !current.before.newlineNum &&
                    !prev.match( "Punctuator", [ "(", "+", "-" ] ) &&
                    current.before.whitespaceNum !== 1 ) {
                    this.log( current, "invalidLiteralLeadingSpacing" );
                }
                // If not followed by punctuator such as ,;:,
                // must be by exact one whitespace
                if ( next &&
                     !current.after.newlineNum &&
                     !next.match( "Punctuator", [ ",", ":", ";", ")" ] ) &&
                     current.after.whitespaceNum !== 1 ) {
                    this.log( current, "invalidLiteralTraillingSpacing" );
                }
            }
        }
    };

AbstractIdiomatic.prototype = new AbstractStandard();
util.extend( AbstractIdiomatic.prototype, members );
module.exports = AbstractIdiomatic;
