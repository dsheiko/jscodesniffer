/**
 * Mocha driven
 */
var esprima = require("esprima"),
    sniffer = require('../lib/Sniffer'),
    assert = require('assert'),
    fs = require('fs'),
    tokenizer = require('../lib/Tokenizer'),
    Token = require("../lib/Tokenizer/Token"),
    TokenizerIterator = require("../lib/Tokenizer/TokenizerIterator"),
    AbstractStandard = require('../standard/AbstractStandard'),
    Idiomatic = require('../standard/Idiomatic'),
    util = require('../lib/Util'),

    getText = function( name ) {
        return fs.readFileSync( "./test/fixtures/" + name, 'utf-8' );
    },
    getFixture = function( name ) {
        return JSON.parse( getText( name ) );
    },
    repeatCall = function( fn, repNum) {
        var i = 1;
        for ( ; i <= repNum; i++ ) {
            fn();
        }
    },
    runTestSuit = function( cases, StandardConstr ) {
        if ( !StandardConstr || !StandardConstr instanceof AbstractStandard ){
            throw new Error("You must pass in coding standard constructor with arguments");
        }
        cases.forEach(function( usecase ){
             var logger = sniffer.run( usecase.js, StandardConstr );
             it( usecase.describe, function(){
                 if ( usecase.expected ) {
                     assert( logger.hasMessage(usecase.expected),
                        usecase.js + " >> " + logger.trace() );

                 } else {
                     assert( logger.isEmpty(),
                        usecase.js + " >> " + logger.trace() );
                 }
             });
        });
    };

describe('Util', function(){
  describe('#sprintf()', function(){
    it('should properly format argument string', function(){
       var cases = getFixture( "util.sprintf.json" );
       cases.forEach(function( usecase ){
           assert.equal( usecase.expected,
                util.sprintf( usecase.format,
                usecase.arguments[0], usecase.arguments[1] ) );
       });
    });
  });
});

describe('Tokenizer', function(){
    var js = getText( "tokenizer.js" );
    it('should properly extend esprima tokens array', function(){
       var tokens = tokenizer.parse( js ),
           token = tokens.current();
       assert.strictEqual( true, tokens instanceof TokenizerIterator );
       assert.strictEqual( true, token instanceof Token );
    });

    it('should properly navigate tokenizer iterator', function(){
       var tokens = tokenizer.parse( js ),
           token;

       repeatCall(function(){
           tokens.next();
       }, 3)
       token = tokens.current();
       assert.strictEqual( "String", token.type );
       assert.strictEqual( "'value'", token.value );

       tokens.nextMatch( "Identifier" );
       token = tokens.current();
       assert.strictEqual( "Identifier", token.type );
       assert.strictEqual( "fn", token.value );

    });
});


describe( 'Idiomatic Coding Style', function(){

    describe( 'Identifier name convention', function(){
       runTestSuit(
        getFixture( "idiomatic.identifier-name-validation.json" ), Idiomatic );
    });

    describe('Constructor name convention', function(){
       runTestSuit(
        getFixture( "idiomatic.constructor-name-validation.json" ), Idiomatic );
    });

    describe('Operator spacing', function(){
       runTestSuit(
        getFixture( "idiomatic.operator-spacing-validation.json" ), Idiomatic );
    });

    describe('Literal spacing', function(){
       runTestSuit(
        getFixture( "idiomatic.literal-spacing-validation.json" ), Idiomatic );
    });
    describe('Argument spacing', function(){
       runTestSuit(
        getFixture( "idiomatic.argument-spacing-validation.json" ), Idiomatic );
    });

});