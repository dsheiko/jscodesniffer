/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var AbstractStandard = require('./AbstractStandard'),
    util = require("../lib/Util"),
    // Custom exception
    StopIteration = StopIteration || (function(){
        var StopIteration = function( message ){
            this.name = "StopIteration";
            this.message = message || "StopIteration thrown";
        };
        StopIteration.prototype = new ReferenceError();
        StopIteration.constructor = StopIteration;
        return StopIteration;
    }()),
    AbstractIdiomatic = function() {
        this.extendExceptionMap({
            "AbstractIdiomatic.invalidOperatorPrecedingSpacing": "There must be one preceding whitespace around operator (%s)",
            "AbstractIdiomatic.invalidOperatorFollowingSpacing": "There must be one following whitespace around operator (%s)",
            "AbstractIdiomatic.invalidLiteralLeadingSpacing": "There must be one leading whitespace for the literal (%s)",
            "AbstractIdiomatic.invalidLiteralTrailingSpacing": "There must be one trailing whitespace for the literal (%s)",
            "AbstractIdiomatic.invalidIdentifierName": "Identifier (%s) must be in PascalCase when it is a constructor, otherwise in camelCase"
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
                specCharsRe = /_/g,
                // checks for cameCase or PascalCase
                isValidIdentifierName = function( string ) {
                    var validRe = /^\$*[a-zA-Z]*[0-9]*$/,
                        isConstantRe = /^[A-Z_]+[0-9]*$/;
                    if ( string === "$" ) {
                        return true;
                    }
                    return isConstantRe.test( string ) ||
                        ( validRe.test( string ) );
                };

            if ( current.match( "Identifier" ) ) {
                // Exception: window.XMLHttpRequest is still a proper named constructor
                if ( tokenizer.get( -1 ) && tokenizer.get( -1 ).match( "Punctuator", [ "." ] ) ) {
                    return true;
                }
                if ( !isValidIdentifierName( current.value.replace( specCharsRe, "" ) ) ) {
                    this.log( current, "AbstractIdiomatic.invalidIdentifierName" );
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
                                that.log( start, "AbstractIdiomatic.invalidOperatorPrecedingSpacing" );

                            ( end.after.whitespaceNum === 1 || end.after.newlineNum ) ||
                                that.log( end, "AbstractIdiomatic.invalidOperatorFollowingSpacing" );
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
                    this.log( current, "AbstractIdiomatic.invalidLiteralLeadingSpacing" );
                }
                // If not followed by punctuator such as ,;:,
                // must be by exact one whitespace
                if ( next &&
                     !current.after.newlineNum &&
                     !next.match( "Punctuator", [ ",", ":", ";", ")" ] ) &&
                     current.after.whitespaceNum !== 1 ) {
                    this.log( current, "AbstractIdiomatic.invalidLiteralTrailingSpacing" );
                }
            }
        }
    };

AbstractIdiomatic.prototype = new AbstractStandard();
util.extend( AbstractIdiomatic.prototype, members );
module.exports = AbstractIdiomatic;
