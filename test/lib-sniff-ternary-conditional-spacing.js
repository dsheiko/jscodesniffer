var should = require('should'),
    fixture = require('./inc/fixture'),
    locEntity = require('./inc/LocEntity'),
    MediatorMock = require('./inc/MediatorMock'),
    SourceCodeStub = require('./inc/SourceCodeStub'),
    sniffClass = require('../lib/Sniff/SyntaxTree/TernaryConditionalPunctuatorsSpacing');


describe('TernaryConditionalPunctuatorsSpacing', function () {
  describe('(Contract)', function () {
    var mediator,
        sniff;

      beforeEach(function(){
        mediator = new MediatorMock();

     });
     it('must throw exception when invalid rule.allowTestTrailingWhitespaces given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( {
            "allowTestTrailingWhitespaces": true,
            "allowConsequentPrecedingWhitespaces": 1,
            "allowConsequentTrailingWhitespaces": 1,
            "allowAlternatePrecedingWhitespaces": 1
          }, null );
        }).should.throw();
      });
      it('must throw exception when invalid rule.allowConsequentPrecedingWhitespaces given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( {
            "allowTestTrailingWhitespaces": 1,
            "allowConsequentPrecedingWhitespaces": [],
            "allowConsequentTrailingWhitespaces": 1,
            "allowAlternatePrecedingWhitespaces": 1
          }, null );
        }).should.throw();
      });
      it('must throw exception when invalid rule.allowConsequentTrailingWhitespaces given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( {
            "allowTestTrailingWhitespaces": 1,
            "allowConsequentPrecedingWhitespaces": 1,
            "allowConsequentTrailingWhitespaces": "",
            "allowAlternatePrecedingWhitespaces": 1
          }, null );
        }).should.throw();
      });
      it('must throw exception when invalid rule.allowAlternatePrecedingWhitespaces given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( {
            "allowTestTrailingWhitespaces": 1,
            "allowConsequentPrecedingWhitespaces": 1,
            "allowConsequentTrailingWhitespaces": 1,
            "allowAlternatePrecedingWhitespaces": null
          }, null );
        }).should.throw();
      });
    });
    /**
     * testing OK
     */
    describe('(cases)', function () {
      var pNode = null,
          mediator,
          sniff,
          rule = {
            "allowTestTrailingWhitespaces": 1,
            "allowConsequentPrecedingWhitespaces": 1,
            "allowConsequentTrailingWhitespaces": 1,
            "allowAlternatePrecedingWhitespaces": 1
          };

      beforeEach(function(){
        mediator = new MediatorMock();

     });
      it('must trigger no violation on (a = true ? 1 : 0;) when spaces required', function () {
         var caseId = "case1";
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "TernaryConditionalPunctuatorsSpacing/" + caseId + ".ok.js" )
           ), mediator );

         pNode = fixture.getJson( "TernaryConditionalPunctuatorsSpacing/" + caseId + ".ok.json" ).body[ 0 ].expression.right;
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });

       it('must trigger violation on (a = true? 1: 0;) when spaces required', function () {
         var caseId = "case2",
             msg;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "TernaryConditionalPunctuatorsSpacing/" + caseId + ".fail.js" )
           ), mediator );

         pNode = fixture.getJson( "TernaryConditionalPunctuatorsSpacing/" + caseId + ".fail.json" ).body[ 0 ].expression.right;
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "TernaryConditionalTestTrailingWhitespaces" );
         msg.should.be.ok;
         msg.payload.actual.should.eql( 0 );
         msg.payload.expected.should.eql( 1 );
       });

       it('must trigger violation on (a = true ?1 : 0;) when spaces required', function () {
         var caseId = "case3",
             msg;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "TernaryConditionalPunctuatorsSpacing/" + caseId + ".fail.js" )
           ), mediator );

         pNode = fixture.getJson( "TernaryConditionalPunctuatorsSpacing/" + caseId + ".fail.json" ).body[ 0 ].expression.right;
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "TernaryConditionalConsequentPrecedingWhitespaces" );
         msg.should.be.ok;
         msg.payload.actual.should.eql( 0 );
         msg.payload.expected.should.eql( 1 );
       });

       it('must trigger violation on (a = true ? 1: 0;) when spaces required', function () {
         var caseId = "case4",
             msg;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "TernaryConditionalPunctuatorsSpacing/" + caseId + ".fail.js" )
           ), mediator );

         pNode = fixture.getJson( "TernaryConditionalPunctuatorsSpacing/" + caseId + ".fail.json" ).body[ 0 ].expression.right;
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "TernaryConditionalConsequentTrailingWhitespaces" );
         msg.should.be.ok;
         msg.payload.actual.should.eql( 0 );
         msg.payload.expected.should.eql( 1 );
       });

       it('must trigger violation on (a = true ? 1 :0;) when spaces required', function () {
         var caseId = "case5",
             msg;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "TernaryConditionalPunctuatorsSpacing/" + caseId + ".fail.js" )
           ), mediator );

         pNode = fixture.getJson( "TernaryConditionalPunctuatorsSpacing/" + caseId + ".fail.json" ).body[ 0 ].expression.right;
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "TernaryConditionalAlternatePrecedingWhitespaces" );
         msg.should.be.ok;
         msg.payload.actual.should.eql( 0 );
         msg.payload.expected.should.eql( 1 );
       });

    });

});
