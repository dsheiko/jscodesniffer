var should = require('should'),
    fixture = require('./inc/fixture'),
    locEntity = require('./inc/LocEntity'),
    MediatorMock = require('./inc/MediatorMock'),
    SourceCodeStub = require('./inc/SourceCodeStub'),
    sniffClass = require('../lib/Sniff/SyntaxTree/ParametersSpacing');


describe('ParametersSpacing', function () {
  describe('(Contract)', function () {
    var mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
     });
     it('must throw exception when rule.allowParamPrecedingWhitespaces is not a number', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowParamPrecedingWhitespaces": true, "allowParamTrailingWhitespaces": 1 } );
        }).should.throw();
      });
      it('must throw exception when rule.allowParamTrailingWhitespaces is not a number', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowParamPrecedingWhitespaces": 1, "allowParamTrailingWhitespaces": true} );
        }).should.throw();
      });
    });
    /**
     * testing cases
     */
    describe('with left spaces = 1, right spaces = 1', function () {
      var pNode = null,
          mediator,
          msg,
          sniff,
          rule = {
            "allowParamPrecedingWhitespaces": 1,
            "allowParamTrailingWhitespaces": 1
          };

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
     });

      it('must trigger no violation on foo = function( a, b ) {}', function () {
         var caseId = "case1";
         pNode = fixture.getJson( "ParametersSpacing/" + caseId + ".json" )
          .body[ 0 ].expression.right;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ParametersSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });

        it('must trigger violation on foo = function(a, b ) {}', function () {
         var caseId = "case2";
         pNode = fixture.getJson( "ParametersSpacing/" + caseId + ".json" )
          .body[ 0 ].expression.right;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ParametersSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ParamPrecedingWhitespaces" );
         msg.should.be.ok;
       });

       it('must trigger violation on foo = function( a,b ) {}', function () {
         var caseId = "case3";
         pNode = fixture.getJson( "ParametersSpacing/" + caseId + ".json" )
          .body[ 0 ].expression.right;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ParametersSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ParamPrecedingWhitespaces" );
         msg.should.be.ok;
       });

       it('must trigger violation on foo = function( a, b) {}', function () {
         var caseId = "case4";
         pNode = fixture.getJson( "ParametersSpacing/" + caseId + ".json" )
          .body[ 0 ].expression.right;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ParametersSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ParamTrailingWhitespaces" );
         msg.should.be.ok;
       });

       it('must trigger no violation on foo = function( a,.. b.. ) {}', function () {
         var caseId = "case5";
         pNode = fixture.getJson( "ParametersSpacing/" + caseId + ".json" )
          .body[ 0 ].expression.right;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ParametersSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });

       it('must trigger violation on foo = function(a,..b ) {}', function () {
         var caseId = "case6";
         pNode = fixture.getJson( "ParametersSpacing/" + caseId + ".json" )
          .body[ 0 ].expression.right;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ParametersSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ParamPrecedingWhitespaces" );
         msg.should.be.ok;
       });


    });

});
