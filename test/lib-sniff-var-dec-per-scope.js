var should = require('should'),
    fixture = require('./inc/fixture'),
    locEntity = require('./inc/LocEntity'),
    MediatorMock = require('./inc/MediatorMock'),
    SourceCodeStub = require('./inc/SourceCodeStub'),
    sniffClass = require('../lib/Sniff/SyntaxTree/VariableDeclarationPerScopeConventions');


describe('VariableDeclarationPerScopeConventions', function () {
  describe('(Contract)', function () {
    var mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
     });
     it('must throw exception when invalid rule.disallowMultiplePerBlockScope given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "disallowMultiplePerBlockScope": 1 } );
        }).should.throw();
      });
    });
    /**
     * cases
     */
    describe('(cases)', function () {
      var mediator,
          msg,
          sniff;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
     });

      it('must trigger violation on 2 variable declarations', function () {
        var caseId = "case1", pNode;

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "VariableDeclarationPerScopeConventions/" + caseId + ".js" )
           ), mediator );

         pNode = fixture.getJson( "VariableDeclarationPerScopeConventions/" + caseId + ".json" ).body[ 0 ].expression.callee;

         sniff.run( { "disallowMultiplePerBlockScope": true }, pNode );
         msg = mediator.getMessage( "MultipleVarDeclarationPerBlockScope" );
         msg.should.be.ok;
       });


       it('must not trigger violation with single declaration but multiple variable declarators', function () {
        var caseId = "case2", pNode;

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "VariableDeclarationPerScopeConventions/" + caseId + ".js" )
           ), mediator );

         pNode = fixture.getJson( "VariableDeclarationPerScopeConventions/" + caseId + ".json" ).body[ 0 ].expression.callee;

         sniff.run( { "disallowMultiplePerBlockScope": true }, pNode );

         mediator.getMessages().should.not.be.ok;
       });

       it('must trigger violation when second variable declaration found in an inner compaund statement', function () {
        var caseId = "case3", pNode;

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "VariableDeclarationPerScopeConventions/" + caseId + ".js" )
           ), mediator );

         pNode = fixture.getJson( "VariableDeclarationPerScopeConventions/" + caseId + ".json" ).body[ 0 ].expression.callee;

         sniff.run( { "disallowMultiplePerBlockScope": true }, pNode );

         msg = mediator.getMessage( "MultipleVarDeclarationPerBlockScope" );
         msg.should.be.ok;
       });
        it('must not trigger violation when second found declaration in a distinct scope', function () {
        var caseId = "case4", pNode;

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "VariableDeclarationPerScopeConventions/" + caseId + ".js" )
           ), mediator );

         pNode = fixture.getJson( "VariableDeclarationPerScopeConventions/" + caseId + ".json" ).body[ 0 ].expression.callee;

         sniff.run( { "disallowMultiplePerBlockScope": true }, pNode );

         mediator.getMessages().should.not.be.ok;
       });

    });

});
