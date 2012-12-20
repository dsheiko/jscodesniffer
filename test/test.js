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
    Jquery = require('../standard/Jquery'),
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
    runTestSuit = function( fixture, StandardConstr ) {
        var cases = getFixture( fixture );
        if ( !StandardConstr || !StandardConstr instanceof AbstractStandard ){
            throw new Error("You must pass in coding standard constructor with arguments");
        }
        cases.forEach(function( usecase, inx ){
             var logger = sniffer.run( usecase.js, StandardConstr ),
                 vardump;
             it( usecase.describe, function(){
                 vardump = fixture + " [" + inx + "]\n\033[0m     " +
                    util.color( "yellow", usecase.js ) +
                    util.color( "lightRed", "\n     >> " + logger.trace());

                 if ( usecase.expected ) {
                    return assert( logger.hasMessage(usecase.expected), vardump);

                 }
                 if ( usecase.unexpected ) {
                    return assert( !logger.hasMessage(usecase.unexpected),
                        vardump);
                 }
                 assert( logger.isEmpty(), vardump);

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


describe( 'Idiomatic Style Manifesto', function(){

    describe( 'Identifier name convention', function(){
       runTestSuit( "idiomatic.identifier-name-validation.json", Idiomatic );
    });
    describe('Constructor name convention', function(){
       runTestSuit( "idiomatic.constructor-name-validation.json", Idiomatic );
    });
    describe('Operator spacing', function(){
       runTestSuit("idiomatic.operator-spacing-validation.json", Idiomatic );
    });
    describe('Literal spacing', function(){
       runTestSuit("idiomatic.literal-spacing-validation.json", Idiomatic );
    });
    describe('Argument spacing', function(){
       runTestSuit("idiomatic.argument-spacing-validation.json", Idiomatic );
    });
    describe('Var statement convention', function(){
       runTestSuit("idiomatic.var-per-space-validation.json", Idiomatic );
    });
    describe('Grouping spacing', function(){
       runTestSuit("idiomatic.inner-grouping-spacing.json", Idiomatic );
    });


});

describe( 'jQuery Coding Style', function(){

    describe( 'Argument spacing', function(){
       runTestSuit( "jquery.argument-spacing-validation.json", Jquery );
    });
    describe('Grouping spacing', function(){
       runTestSuit( "jquery.inner-grouping-spacing.json", Jquery );
    });
});