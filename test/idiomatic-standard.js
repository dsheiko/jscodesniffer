/*jshint -W068 */
/*jshint multistr: true */
var Sniffer = require( "../lib/Sniffer" );

require( "should" );

Array.prototype.hasErrorCode = function( errCode ) {
  return !!this.filter(function( msg ){
    return msg.errorCode === errCode;
  }).length;
};

describe( "Idiomatic standard", function () {

    var OPTIONS = {
          highlight: "1",
          report: "summary",
          standard: "Idiomatic",
          reportWidth: 84
      };

    describe( " ( A. Parens, Braces, Linebreaks ) ", function () {
      var sniffer, logger = null;
      beforeEach(function(){
        sniffer = new Sniffer();
      });

      it("'if' multiline with parens must pass", function () {
        var code = "if(condition) doSomething();";
        logger = sniffer.getTestResults( code, OPTIONS );
        logger.getMessages().hasErrorCode("CompoundStatementRequireBraces").should.be.ok;
        logger.getMessages().hasErrorCode("CompoundStatementRequireMultipleLines").should.be.ok;
      });
      it("'while' multiline with parens must pass", function () {
        var code = "while(condition) iterating++;";
        logger = sniffer.getTestResults( code, OPTIONS );
        logger.getMessages().hasErrorCode("CompoundStatementRequireBraces").should.be.ok;
        logger.getMessages().hasErrorCode("CompoundStatementRequireMultipleLines").should.be.ok;
      });
      it("'for' multiline with parens must pass", function () {
        var code = "for(var i=0;i<100;i++) someIterativeFn();";
        logger = sniffer.getTestResults( code, OPTIONS );
        logger.getMessages().hasErrorCode("CompoundStatementRequireBraces").should.be.ok;
        logger.getMessages().hasErrorCode("CompoundStatementRequireMultipleLines").should.be.ok;
      });

    });

    describe( " ( B. Assignments, Declarations, Functions ( Named, Expression, Constructor ) ) ", function () {
      var sniffer, logger = null;
      beforeEach(function(){
        sniffer = new Sniffer();
      });

      it("Literal notations", function () {
        logger = sniffer.getTestResults( "var obj = { };", OPTIONS );
        logger.getMessages().hasErrorCode( "EmptyConstructsSpacing" ).should.be.ok;
      });
      it("Literal notations", function () {
        logger = sniffer.getTestResults( "var arr = [ ];", OPTIONS );
        logger.getMessages().hasErrorCode( "EmptyConstructsSpacing" ).should.be.ok;
      });

      it("Variables", function () {
        logger = sniffer.getTestResults( "var foo= \"bar\";", OPTIONS );
        logger.getMessages().hasErrorCode( "OperatorPrecedingWhitespaces" ).should.be.ok;
      });
      it("Variables", function () {
        logger = sniffer.getTestResults( "var foo =\"bar\";", OPTIONS );
        logger.getMessages().hasErrorCode( "OperatorTrailingWhitespaces" ).should.be.ok;
      });

    });


    describe( " ( 2.B.1.2. Using only one `var` per scope (function) promotes readability ) ", function () {
      var sniffer, logger = null;

      beforeEach(function(){
        sniffer = new Sniffer();
      });


      it("bad", function () {
        logger = sniffer.getTestResults( "(function(){var foo = true; var bar = false;})", OPTIONS );
        logger.getMessages().hasErrorCode( "MultipleVarDeclarationPerBlockScope" ).should.be.ok;
      });
      it("good", function () {
        logger = sniffer.getTestResults( "(function(){var foo = true, bar = false;})", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });
      it("good", function () {
        logger = sniffer.getTestResults( "(function(){var // comment\nfoo = true, bar = false;})", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });
      it("bad", function () {
        logger = sniffer.getTestResults( "(function(){ a = 1; var foo = true;})", OPTIONS );
        logger.getMessages().hasErrorCode( "RequireVarDeclarationInTheBeginning" ).should.be.ok;
      });
      it("good", function () {
        logger = sniffer.getTestResults( "(function(){ \"use strict\"; var foo = true;})", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });
    });

    describe( " (  2.B.2.1 ) ", function () {
      var sniffer, logger = null;
      beforeEach(function(){
        sniffer = new Sniffer();
      });

      it("Named Function Declaration", function () {
        logger = sniffer.getTestResults( "function foo(arg1, argN ) {}", OPTIONS );
        logger.getMessages().hasErrorCode( "ParamPrecedingWhitespaces" ).should.be.ok;
      });
      it("Named Function Declaration", function () {
        logger = sniffer.getTestResults( "function foo( arg1, argN) {}", OPTIONS );
        logger.getMessages().hasErrorCode( "ParamTrailingWhitespaces" ).should.be.ok;
      });
      it("Usage", function () {
        logger = sniffer.getTestResults( "foo(arg1, argN );", OPTIONS );
        logger.getMessages().hasErrorCode( "ArgPrecedingWhitespaces" ).should.be.ok;
      });
      it("Usage", function () {
        logger = sniffer.getTestResults( "foo( arg1, argN);", OPTIONS );
        logger.getMessages().hasErrorCode( "ArgTrailingWhitespaces" ).should.be.ok;
      });

      it("Usage", function () {
        logger = sniffer.getTestResults( "square( 10 );", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });

      it("Named Function Declaration", function () {
        logger = sniffer.getTestResults( "function square( number ) {\nreturn number * number;\n}", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });

      it("Really contrived continuation passing style", function () {
        logger = sniffer.getTestResults( "function square( number, callback ) {\ncallback( number * number );\n}", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });

      it("Function Expression", function () {
        logger = sniffer.getTestResults( "var square = function( number ) {\nreturn number * number;\n};", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });

    });

    describe( " (  2.B.2.4 ) ", function () {
      var sniffer, logger = null;
      beforeEach(function(){
        sniffer = new Sniffer();
      });

      it("Constructor Declaration", function () {
        logger = sniffer.getTestResults( "function FooBar( options ) {\nthis.options = options;\n}", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });
      it("Constructor Declaration", function () {
        logger = sniffer.getTestResults( "function Foo_Bar( options ) {\nthis.options = options;\n}", OPTIONS );
        logger.getMessages().hasErrorCode( "FunctionNamingConventions" ).should.be.ok;
      });
    });

    describe( " ( C. Exceptions, Slight Deviations ) ", function () {
      var sniffer, logger = null;
      beforeEach(function(){
        sniffer = new Sniffer();
      });
      it("Functions with callbacks", function () {
        logger = sniffer.getTestResults( "foo(function() {});", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });
      it("Function accepting an array, no space", function () {
        logger = sniffer.getTestResults( "foo([ \"alpha\", \"beta\" ]);", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });
      it("Single argument string literal, no space", function () {
        logger = sniffer.getTestResults( "foo(\"bar\")", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });
      it("Inner grouping parens, no space", function () {
        logger = sniffer.getTestResults( "if ( !(foo in obj) ) {\n}", OPTIONS );
        logger.getMessages().length.should.not.be.ok;
      });
    });


});
