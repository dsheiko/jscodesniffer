var should = require('should'),
    fixture = require('./inc/fixture'),
    locEntity = require('./inc/LocEntity'),
    MediatorMock = require('./inc/MediatorMock'),
    SourceCodeStub = require('./inc/SourceCodeStub'),
    sniffClass = require('../lib/Sniff/SyntaxTree/ObjectLiteralSpacing');


describe('ObjectLiteralSpacing', function () {
  describe('(Contract)', function () {
    var mediator,
        sniff;
      beforeEach(function(){
        mediator = new MediatorMock();

     });

      it('must throw exception when rule.allowKeyPrecedingWhitespaces is not a number', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowKeyPrecedingWhitespaces": true }, null );
        }).should.throw();
      });

      it('must throw exception when rule.allowKeyTrailingWhitespaces  is not a number', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowKeyTrailingWhitespaces": true }, null );
        }).should.throw();
      });

      it('must throw exception when rule.allowValuePrecedingWhitespaces is not a number', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowValuePrecedingWhitespaces": true }, null );
        }).should.throw();
      });

      it('must throw exception when rule.allowValueTrailingWhitespaces is not a number', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowValueTrailingWhitespaces": true }, null );
        }).should.throw();
      });
    });
    /**
    * testing Cases
    */
   describe('with key spacing 1,0 and value spacing 1,1', function () {
     var pNode = null,
         mediator,
         msg,
         sniff,
         rule =  {
            "allowKeyPrecedingWhitespaces": 1,
            "allowKeyTrailingWhitespaces": 0,
            "allowValuePrecedingWhitespaces": 1,
            "allowValueTrailingWhitespaces": 1
          };

     beforeEach(function(){
       mediator = new MediatorMock();
       msg = false;
    });


     it('must trigger no violation on o = { p: 1 }', function () {
        var caseId = "case1";
        pNode = fixture.getJson( "ObjectLiteralSpacing/" + caseId + ".json" )
         .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ObjectLiteralSpacing/" + caseId +
         ".js" ) ), mediator );
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });

      it('must trigger violation on o = {p: 1 }', function () {
        var caseId = "case2";
        pNode = fixture.getJson( "ObjectLiteralSpacing/" + caseId + ".json" )
         .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ObjectLiteralSpacing/" + caseId +
         ".js" ) ), mediator );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyKeyPrecedingSpacing" );
        msg.should.be.ok;
      });

      it('must trigger violation on o = { p : 1 }', function () {
        var caseId = "case3";
        pNode = fixture.getJson( "ObjectLiteralSpacing/" + caseId + ".json" )
         .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ObjectLiteralSpacing/" + caseId +
         ".js" ) ), mediator );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyKeyTrailingSpacing" );
        msg.should.be.ok;
      });

      it('must trigger violation on o = { p:1 }', function () {
        var caseId = "case4";
        pNode = fixture.getJson( "ObjectLiteralSpacing/" + caseId + ".json" )
         .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ObjectLiteralSpacing/" + caseId +
         ".js" ) ), mediator );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyValuePrecedingSpacing" );
        msg.should.be.ok;
      });
      it('must trigger violation on o = { p: 1}', function () {
        var caseId = "case5";
        pNode = fixture.getJson( "ObjectLiteralSpacing/" + caseId + ".json" )
         .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ObjectLiteralSpacing/" + caseId +
         ".js" ) ), mediator );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyValueTrailingSpacing" );
        msg.should.be.ok;
      });

      it('must trigger no violation on o = { p1: 1, p2: 2 }', function () {
        var caseId = "case6";
        pNode = fixture.getJson( "ObjectLiteralSpacing/" + caseId + ".json" )
         .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ObjectLiteralSpacing/" + caseId +
         ".js" ) ), mediator );
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
      it('must trigger no violation on o = {..p1: 1,..p2: 2..}', function () {
        var caseId = "case7";
        pNode = fixture.getJson( "ObjectLiteralSpacing/" + caseId + ".json" )
         .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ObjectLiteralSpacing/" + caseId +
         ".js" ) ), mediator );
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
      it('must trigger violation on o = {..p1: 1,..p2: 2}', function () {
        var caseId = "case8";
        pNode = fixture.getJson( "ObjectLiteralSpacing/" + caseId + ".json" )
         .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ObjectLiteralSpacing/" + caseId +
         ".js" ) ), mediator );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyValueTrailingSpacing" );
        msg.should.be.ok;
      });
      it('must trigger violation on o = {p1: 1,..p2: 2..}', function () {
        var caseId = "case9";
        pNode = fixture.getJson( "ObjectLiteralSpacing/" + caseId + ".json" )
         .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ObjectLiteralSpacing/" + caseId +
         ".js" ) ), mediator );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyKeyPrecedingSpacing" );
        msg.should.be.ok;
      });


  });
});
