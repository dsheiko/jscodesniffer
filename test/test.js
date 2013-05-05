/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 *
 * Mocha driven tests
 */
var esprima = require("esprima"),
    sniffer = require('../lib/Sniffer'),
    assert = require('assert'),
    fs = require('fs'),
    tokenizer = require('../lib/Tokenizer'),
    Token = require("../lib/Tokenizer/Token"),
    TokenizerIterator = require("../lib/Tokenizer/TokenizerIterator"),
    util = require('../lib/Util'),

    getText = function( name ) {
        return fs.readFileSync( "./test/fixtures/" + name, 'utf-8' );
    },
    getFixture = function( name ) {
        return JSON.parse( getText( name ) );
    },
    repeatCall = function( fn, repNum ) {
        var i = 1;
        for ( ; i <= repNum; i++ ) {
            fn();
        }
    },
    runTestSuit = function( fixture, StandardName ) {
        var cases = getFixture( fixture );
        cases.forEach(function( usecase, inx ){
             var logger = sniffer.run( usecase.js, StandardName ),
                 vardump;
             it( usecase.describe, function(){
                 vardump = fixture + " [" + inx + "]\n\033[0m     " +
                    util.color( "yellow", usecase.js ) +
                    util.color( "light red", "\n     >> " + logger.trace() );

                 if ( usecase.expected ) {
                    return assert( logger.hasMessage(usecase.expected), vardump );

                 }
                 if ( usecase.unexpected ) {
                    return assert( !logger.hasMessage(usecase.unexpected),
                        vardump );
                 }
                 assert( logger.isEmpty(), vardump );

             });
        });
    };

describe( 'Util', function(){
  describe( '#sprintf()', function(){
    it( 'should properly format argument string', function(){
       var cases = getFixture("util.sprintf.json");
       cases.forEach(function( usecase ){
           assert.equal( usecase.expected,
                util.sprintf( usecase.format,
                usecase.cases[ 0 ], usecase.cases[ 1 ] ) );
       });
    });
  });
});

describe( 'Tokenizer', function(){
    var js = getText("tokenizer.js");
    it( 'should properly extend esprima tokens array', function(){
       var tokens = tokenizer.parse( js ),
           token = tokens.current();
       assert.strictEqual( true, tokens instanceof TokenizerIterator );
       assert.strictEqual( true, token instanceof Token );
    });

    it( 'should properly navigate tokenizer iterator', function(){
       var tokens = tokenizer.parse( js ),
           token;

       repeatCall( function(){
           tokens.next();
       }, 3 );
       token = tokens.current();
       assert.strictEqual( "String", token.type );
       assert.strictEqual( "'value'", token.value );

       tokens.nextMatch("Identifier");
       token = tokens.current();
       assert.strictEqual( "Identifier", token.type );
       assert.strictEqual( "fn", token.value );

    });
});


describe( 'Idiomatic Style Manifesto', function(){

    describe( 'Identifier name convention', function(){
       runTestSuit( "idiomatic.identifier-name-validation.json", "Idiomatic" );
    });
    describe( 'Constructor name convention', function(){
       runTestSuit( "idiomatic.constructor-name-validation.json", "Idiomatic" );
    });
    describe( 'Operator spacing', function(){
       runTestSuit( "idiomatic.operator-spacing-validation.json", "Idiomatic" );
    });
    describe( 'Literal spacing', function(){
       runTestSuit( "idiomatic.literal-spacing-validation.json", "Idiomatic" );
    });
    describe( 'Argument spacing', function(){
       runTestSuit( "idiomatic.argument-spacing-validation.json", "Idiomatic" );
    });
    describe( 'Var statement convention', function(){
       runTestSuit( "idiomatic.var-per-space-validation.json", "Idiomatic" );
    });
    describe( 'Grouping spacing', function(){
       runTestSuit( "idiomatic.inner-grouping-spacing.json", "Idiomatic" );
    });


});

describe( 'jQuery Coding Style', function(){

    describe( 'Argument spacing', function(){
       runTestSuit( "jquery.argument-spacing-validation.json", "Jquery" );
    });
    describe( 'Grouping spacing', function(){
       runTestSuit( "jquery.inner-grouping-spacing.json", "Jquery" );
    });
});