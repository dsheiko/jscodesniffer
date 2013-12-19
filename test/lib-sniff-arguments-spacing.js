var should = require('../node_modules/should/should'),
    fixture = require('./inc/fixture'),
    locEntity = require('./inc/LocEntity'),
    MediatorMock = require('./inc/MediatorMock'),
    SourceCodeStub = require('./inc/SourceCodeStub'),
    sniffClass = require('../lib/Sniff/SyntaxTree/ArgumentsSpacing');


describe('ArgumentsSpacing', function () {
  describe('(Contract)', function () {
    var mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
     });
     it('must throw exception when rule.allowArgPrecedingWhitespaces is not a number', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { allowArgPrecedingWhitespaces: true, allowArgTrailingWhitespaces: 1 } );
        }).should.throw();
      });
      it('must throw exception when rule.allowArgTrailingWhitespaces is not a number', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { allowArgPrecedingWhitespaces: 1, allowArgTrailingWhitespaces: true } );
        }).should.throw();
      });
       it('must throw exception when rule.exceptions is not valid', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule({
            allowArgPrecedingWhitespaces: 1,
            allowArgTrailingWhitespaces: true,
            exceptions: {
              singleArg: {
                "for": 2
              }
            }
          });
        }).should.throw();
      });
    });
    /**
     * testing IfStatement
     */
    describe('with jQuery ruleset', function () {
      var pNode = null,
          mediator,
          msg,
          sniff,
          rule = {
            "allowArgPrecedingWhitespaces": 1,
            "allowArgTrailingWhitespaces": 1,
            "exceptions": {
              "singleArg" : {
                "for": [ "FunctionExpression", "ArrayExpression", "ObjectExpression" ],
                "allowArgPrecedingWhitespaces": 0,
                "allowArgTrailingWhitespaces": 0
              },
              "firstArg": {
                "for": [ "FunctionExpression" ],
                "allowArgPrecedingWhitespaces": 0
              },
              "lastArg": {
                "for": [ "FunctionExpression" ],
                "allowArgTrailingWhitespaces": 0
              }
            }
          };

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
     });

      it('must trigger no violation on a( 1, 1 )', function () {
         var caseId = "case1";
         pNode = fixture.getJson( "ArgumentsSpacing/" + caseId + ".json" ).body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArgumentsSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });
       it('must trigger violation on a(1, 1 )', function () {
         var caseId = "case2";
         pNode = fixture.getJson( "ArgumentsSpacing/" + caseId + ".json" ).body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArgumentsSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ArgPrecedingWhitespaces" );
         msg.should.be.ok;
       });
       it('must trigger violation on a( 1,1 )', function () {
         var caseId = "case3";
         pNode = fixture.getJson( "ArgumentsSpacing/" + caseId + ".json" ).body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArgumentsSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ArgPrecedingWhitespaces" );
         msg.should.be.ok;
       });
       it('must trigger violation on a( 1, 1)', function () {
         var caseId = "case4";
         pNode = fixture.getJson( "ArgumentsSpacing/" + caseId + ".json" ).body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArgumentsSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         msg = mediator.getMessage( "ArgTrailingWhitespaces" );
         msg.should.be.ok;
       });
        it('must trigger no violation on a( 1,.. 1..)', function () {
         var caseId = "case5";
         pNode = fixture.getJson( "ArgumentsSpacing/" + caseId + ".json" ).body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArgumentsSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });


       it('must trigger no violation on a({ p: 1 })', function () {
         var caseId = "case6";
         pNode = fixture.getJson( "ArgumentsSpacing/" + caseId + ".json" ).body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArgumentsSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });
       it('must trigger no violation on a([ 1 ])', function () {
         var caseId = "case7";
         pNode = fixture.getJson( "ArgumentsSpacing/" + caseId + ".json" ).body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArgumentsSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });
       it('must trigger no violation on a(function(){})', function () {
         var caseId = "case8";
         pNode = fixture.getJson( "ArgumentsSpacing/" + caseId + ".json" ).body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArgumentsSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });

       it('must trigger no violation on a(function(){}, 1 )', function () {
         var caseId = "case9";
         pNode = fixture.getJson( "ArgumentsSpacing/" + caseId + ".json" ).body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArgumentsSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });


       it('must trigger no violation on o.p( 1, 1 ).p( 1 )', function () {
         var caseId = "case11";
         pNode = fixture.getJson( "ArgumentsSpacing/" + caseId + ".json" ).body[ 0 ].expression;
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ArgumentsSpacing/" + caseId + ".js" )
           ), mediator );
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });

    });

});
