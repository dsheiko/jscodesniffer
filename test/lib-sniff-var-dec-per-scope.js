/*jshint -W068 */
var
		/**
		 * @constant
		 * @type {string}
		 * @default
		 */
		TEST_SUITE_NAME = "VariableDeclarationPerScopeConventions",
		/** @type {helper} */
		helper = require( "./inc/helper" )( TEST_SUITE_NAME ),
		/** @type {MediatorMock} */
    MediatorMock = require( "./inc/MediatorMock" ),
		/** @type {SourceCodeStub} */
    SourceCodeStub = require( "./inc/SourceCodeStub" ),
		/** @type {Sniff/SyntaxTree/ArrayLiteralSpacing} */
    sniffClass = require( "../lib/Sniff/SyntaxTree/" + TEST_SUITE_NAME );

require( "should" );
describe( TEST_SUITE_NAME, function () {
  describe( "(Contract)", function () {
    var mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });
      it("must throw exception when invalid rule.disallowMultiplePerBlockScope given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "disallowMultiplePerBlockScope": 1 } );
        }).should[ "throw" ]();
      });
    });
    /**
      * cases
      */
    describe( "(cases)", function () {
      var mediator,
          msg,
          sniff;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });

      it("must trigger violation on 2 variable declarations", function () {
        var caseId = "case1", pNode;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );
          pNode = helper.getTree( caseId ).body[ 0 ].expression.callee;
          sniff.run( { "disallowMultiplePerBlockScope": true }, pNode );
          msg = mediator.getMessage( "MultipleVarDeclarationPerBlockScope" );
          msg.should.be.ok;
        });


        it("must not trigger violation with single declaration but multiple variable declarators", function () {
					var caseId = "case2", pNode;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );
          pNode = helper.getTree( caseId ).body[ 0 ].expression.callee;
          sniff.run( { "disallowMultiplePerBlockScope": true }, pNode );
          mediator.getMessages().should.not.be.ok;
        });

        it("must trigger violation when second variable declaration found in an inner compaund statement", function () {
					var caseId = "case3", pNode;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );
          pNode = helper.getTree( caseId ).body[ 0 ].expression.callee;
          sniff.run( { "disallowMultiplePerBlockScope": true }, pNode );
          msg = mediator.getMessage( "MultipleVarDeclarationPerBlockScope" );
          msg.should.be.ok;
        });

        it("must not trigger violation when second found declaration in a distinct scope", function () {
        var caseId = "case4", pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId )
            ), mediator );

          pNode = helper.getTree( caseId ).body[ 0 ].expression.callee;

          sniff.run( { "disallowMultiplePerBlockScope": true }, pNode );

          mediator.getMessages().should.not.be.ok;
        });


        it("must not trigger violation when in the beginning of the scope", function () {
        var caseId = "case6", pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId )
            ), mediator );

          pNode = helper.getTree( caseId ).body[ 0 ].expression;

          sniff.run( { "disallowMultiplePerBlockScope": true, "requireInTheBeginning": true }, pNode );

          mediator.getMessages().should.not.be.ok;
        });

        it("must trigger violation when not in the beginning of the scope", function () {
        var caseId = "case7", pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId )
            ), mediator );

          pNode = helper.getTree( caseId ).body[ 0 ].expression;

          sniff.run( { "disallowMultiplePerBlockScope": true, "requireInTheBeginning": true }, pNode );

          msg = mediator.getMessage( "RequireVarDeclarationInTheBeginning" );
          msg.should.be.ok;
        });

				 it("must trigger violation when var foo; var bar; in the program scope", function () {
					var caseId = "case8", pNode;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );
          pNode = helper.getTree( caseId );
          sniff.run( { "disallowMultiplePerBlockScope": true, "requireInTheBeginning": true }, pNode );
          msg = mediator.getMessage( "MultipleVarDeclarationPerBlockScope" );
          msg.should.be.ok;
        });
				it("must trigger violation when foo = 1; var bar; in the program scope", function () {
					var caseId = "case9", pNode;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );
          pNode = helper.getTree( caseId );
          sniff.run( { "disallowMultiplePerBlockScope": true, "requireInTheBeginning": true }, pNode );
          msg = mediator.getMessage( "RequireVarDeclarationInTheBeginning" );
          msg.should.be.ok;
        });

    });

});
