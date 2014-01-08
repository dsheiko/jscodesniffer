/*jshint -W068 */
var fixture = require( "./inc/fixture" ),
    MediatorMock = require( "./inc/MediatorMock" ),
    SourceCodeStub = require( "./inc/SourceCodeStub" ),
    sniffClass = require( "../lib/Sniff/Token/QuoteConventions" );

require( "should" );
describe( "QuoteConventions", function () {
  describe( "(Contract)", function () {
    var mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });
      it("must throw exception when invalid rule.allowDoubleQuotes given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowDoubleQuotes": 1, "allowSingleQuotes": true }, null );
        }).should[ "throw" ]();
      });
      it("must throw exception when invalid rule.allowSingleQuotes given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowDoubleQuotes": true, "allowSingleQuotes": 1 }, null );
        }).should[ "throw" ]();
      });
    });
    /**
      * testing allowSingleQuotes = false, allowDoubleQuotes = true
      */
    describe( "with allowSingleQuotes = false, allowDoubleQuotes = true", function () {
      var token = null,
          mediator,
          msg,
          sniff,
          caseId = "case1",
          rule = { "allowDoubleQuotes": true, "allowSingleQuotes": false };

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });

      it("must not trigger violation on (var a = \"string\";)", function () {
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "QuoteConventions/" + caseId + ".ok.js" )
            ), mediator );

          token = fixture.getJson( "QuoteConventions/" + caseId + ".ok.json" );
          sniff.run( rule, token );
          mediator.getMessages().should.not.be.ok;
        });

        it("must trigger violation on (var a = 'string';)", function () {
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "QuoteConventions/" + caseId + ".fail.js" )
            ), mediator );

          token = fixture.getJson( "QuoteConventions/" + caseId + ".fail.json" );
          sniff.run( rule, token );
          msg = mediator.getMessage( "QuoteConventionsSingleQuotesNotAllowed" );
          msg.should.be.ok;
        });

    });

      /**
      * testing allowSingleQuotes = true, allowDoubleQuotes = false
      */
    describe( "with allowSingleQuotes = true, allowDoubleQuotes = false", function () {
      var token = null,
          mediator,
          msg,
          sniff,
          caseId = "case1",
          rule = { "allowDoubleQuotes": false, "allowSingleQuotes": true };

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });

      it("must not trigger violation on (var a = \"string\";)", function () {
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "QuoteConventions/" + caseId + ".ok.js" )
            ), mediator );

          token = fixture.getJson( "QuoteConventions/" + caseId + ".ok.json" );
          sniff.run( rule, token );
          msg = mediator.getMessage( "QuoteConventionsDoubleQuotesNotAllowed" );
          msg.should.be.ok;

        });

        it("must trigger violation on (var a = 'string';)", function () {
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "QuoteConventions/" + caseId + ".fail.js" )
            ), mediator );

          token = fixture.getJson( "QuoteConventions/" + caseId + ".fail.json" );
          sniff.run( rule, token );
          mediator.getMessages().should.not.be.ok;
        });

    });

});
