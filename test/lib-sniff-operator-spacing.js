var should = require('should'),
    fixture = require('./inc/fixture'),
    locEntity = require('./inc/LocEntity'),
    MediatorMock = require('./inc/MediatorMock'),
    SourceCodeStub = require('./inc/SourceCodeStub'),
    sniffClass = require('../lib/Sniff/SyntaxTree/OperatorSpacing');


describe('OperatorSpacing', function () {
  describe('(Contract)', function () {
    var mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
     });
     it('must throw exception when invalid rule.allowOperatorPrecedingWhitespaces given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "allowOperatorPrecedingWhitespaces": true, "allowOperatorTrailingWhitespaces" : 1 } );
        }).should[ "throw" ]();
      });
      it('must throw exception when invalid rule.allowOperatorTrailingWhitespaces given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "allowOperatorPrecedingWhitespaces": 1, "allowOperatorTrailingWhitespaces" : true } );
        }).should[ "throw" ]();
      });
    });
    /**
     * cases
     */
    describe('(cases)', function () {
      var mediator,
          msg,
          sniff,
          rule = {
            "allowOperatorPrecedingWhitespaces": 1,
            "allowOperatorTrailingWhitespaces": 1
          };

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
     });

      it('must trigger violation on (1+ 1)', function () {
        var caseId = "case1", pNode;

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "OperatorSpacing/" + caseId + ".js" )
           ), mediator );

         pNode = fixture.getJson( "OperatorSpacing/" + caseId + ".json" ).body[ 0 ].expression;

         sniff.run( rule, pNode );
         msg = mediator.getMessage( "OperatorPrecedingWhitespaces" );
         msg.should.be.ok;
       });

       it('must trigger violation on (1 +1)', function () {
        var caseId = "case2", pNode;

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "OperatorSpacing/" + caseId + ".js" )
           ), mediator );

         pNode = fixture.getJson( "OperatorSpacing/" + caseId + ".json" ).body[ 0 ].expression;

         sniff.run( rule, pNode );
         msg = mediator.getMessage( "OperatorTrailingWhitespaces" );
         msg.should.be.ok;
       });



       it('must not trigger on (1 + 1)', function () {
        var caseId = "case3", pNode;

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "OperatorSpacing/" + caseId + ".js" )
           ), mediator );

         pNode = fixture.getJson( "OperatorSpacing/" + caseId + ".json" ).body[ 0 ].expression;

         sniff.run( rule, pNode );

         mediator.getMessages().should.not.be.ok;
       });

        it("must not trigger on (\"1\" + \"1\")", function () {
        var caseId = "case4", pNode;

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "OperatorSpacing/" + caseId + ".js" )
           ), mediator );

         pNode = fixture.getJson( "OperatorSpacing/" + caseId + ".json" ).body[ 0 ].expression;

         sniff.run( rule, pNode );

         mediator.getMessages().should.not.be.ok;
       });

       it('must trigger violation on (1>>> 1)', function () {
        var caseId = "case1", pNode;

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "OperatorSpacing/" + caseId + ".js" )
           ), mediator );

         pNode = fixture.getJson( "OperatorSpacing/" + caseId + ".json" ).body[ 0 ].expression;

         sniff.run( rule, pNode );
         msg = mediator.getMessage( "OperatorPrecedingWhitespaces" );
         msg.should.be.ok;
       });

      it('must trigger violation on (a= 1 + 1)', function () {
        var caseId = "case6", pNode;

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "OperatorSpacing/" + caseId + ".js" )
           ), mediator );

         pNode = fixture.getJson( "OperatorSpacing/" + caseId + ".json" ).body[ 0 ].expression;

         sniff.run( rule, pNode );
         msg = mediator.getMessage( "OperatorPrecedingWhitespaces" );
         msg.should.be.ok;
       });

        it("must not trigger on (a = 1 + 1)", function () {
        var caseId = "case7", pNode;

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "OperatorSpacing/" + caseId + ".js" )
           ), mediator );

         pNode = fixture.getJson( "OperatorSpacing/" + caseId + ".json" ).body[ 0 ].expression;

         sniff.run( rule, pNode );

         mediator.getMessages().should.not.be.ok;
       });


    });

});
