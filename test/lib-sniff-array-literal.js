var should = require('should'),
    fixture = require('./inc/fixture'),
    locEntity = require('./inc/LocEntity'),
    MediatorMock = require('./inc/MediatorMock'),
    SourceCodeStub = require('./inc/SourceCodeStub'),
    sniffClass = require('../lib/Sniff/SyntaxTree/ArrayLiteralSpacing');


describe('ArrayLiteralSpacing', function () {
  describe('(Contract)', function () {
    var pNode = null,
        mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });
      it('must throw exception when rule.allowElementPrecedingWhitespaces is not a number', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowElementPrecedingWhitespaces": "", "allowElementTrailingWhitespaces": 1 }, null );
        }).should[ "throw" ]();
      });
      it('must throw exception when rule.allowElementTrailingWhitespaces  is not a number', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowElementPrecedingWhitespaces": 1, "allowElementTrailingWhitespaces": false }, null );
        }).should[ "throw" ]();
      });
    });
    /**
     * testing Cases
     */
    describe('with left spaces = 1, right spaces = 1', function () {
      var pNode = null,
          mediator,
          msg,
          sniff,
          rule = { "allowElementPrecedingWhitespaces": 1, "allowElementTrailingWhitespaces": 1 };

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
     });

      it('must not trigger violation on ([ 1, 1 ])', function () {
         var caseId = "case1",
             expected = "ok" ;
         pNode = fixture.getJson( "ArrayLiteralSpacing/" + caseId + "." + expected + ".json" )
          .body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArrayLiteralSpacing/" + caseId +
          "." + expected + ".js" ) ), mediator );
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });

       it('must trigger violation on ([1, 1 ])', function () {
         var caseId = "case1a",
             expected = "fail" ;
         pNode = fixture.getJson( "ArrayLiteralSpacing/" + caseId + "." + expected + ".json" )
          .body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArrayLiteralSpacing/" + caseId +
          "." + expected + ".js" ) ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ArraylElementPrecedingSpacing" );
         msg.should.be.ok;
       });

       it('must trigger violation on ([ 1,1 ])', function () {
         var caseId = "case1b",
             expected = "fail" ;
         pNode = fixture.getJson( "ArrayLiteralSpacing/" + caseId + "." + expected + ".json" )
          .body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArrayLiteralSpacing/" + caseId +
          "." + expected + ".js" ) ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ArraylElementPrecedingSpacing" );
         msg.should.be.ok;
       });
       it('must trigger violation on ([ 1, 1])', function () {
         var caseId = "case1c",
             expected = "fail" ;
         pNode = fixture.getJson( "ArrayLiteralSpacing/" + caseId + "." + expected + ".json" )
          .body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArrayLiteralSpacing/" + caseId +
          "." + expected + ".js" ) ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ArraylElementTrailingSpacing" );
         msg.should.be.ok;
       });

       it('must not trigger violation on ([ 1, 1 ]) multiline', function () {
         var caseId = "case2",
             expected = "ok" ;
         pNode = fixture.getJson( "ArrayLiteralSpacing/" + caseId + "." + expected + ".json" )
          .body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArrayLiteralSpacing/" + caseId +
          "." + expected + ".js" ) ), mediator );
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });

       it('must trigger violation on ([1,..1..])', function () {
         var caseId = "case2a",
             expected = "fail" ;
         pNode = fixture.getJson( "ArrayLiteralSpacing/" + caseId + "." + expected + ".json" )
          .body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArrayLiteralSpacing/" + caseId +
          "." + expected + ".js" ) ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ArraylElementPrecedingSpacing" );
         msg.should.be.ok;
       });
        it('must trigger violation on ([..1,..1])', function () {
         var caseId = "case2b",
             expected = "fail" ;
         pNode = fixture.getJson( "ArrayLiteralSpacing/" + caseId + "." + expected + ".json" )
          .body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArrayLiteralSpacing/" + caseId +
          "." + expected + ".js" ) ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ArraylElementTrailingSpacing" );
         msg.should.be.ok;
       });

    });

});
