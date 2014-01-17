/*jshint -W068 */
var
		/**
		 * @constant
		 * @type {string}
		 * @default
		 */
		TEST_SUITE_NAME = "OperatorSpacing",
		/** @type {helper} */
		helper = require( "./inc/helper" )( TEST_SUITE_NAME ),
		/** @type {TokenIteratorStub} */
		TokenIteratorStub = require( "./inc/TokenIteratorStub" ),
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
      it("must throw exception when invalid rule.allowOperatorPrecedingWhitespaces given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "allowOperatorPrecedingWhitespaces": true, "allowOperatorTrailingWhitespaces" : 1 } );
        }).should[ "throw" ]();
      });
      it("must throw exception when invalid rule.allowOperatorTrailingWhitespaces given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "allowOperatorPrecedingWhitespaces": 1, "allowOperatorTrailingWhitespaces" : true } );
        }).should[ "throw" ]();
      });
    });
    /**
      * cases
      */
    describe( "(cases)", function () {
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

      it("must trigger violation on (1+ 1)", function () {
        var caseId = "case1", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].expression;

          sniff.run( rule, pNode );
          msg = mediator.getMessage( "OperatorPrecedingWhitespaces" );
          msg.should.be.ok;
        });

        it("must trigger violation on (1 +1)", function () {
        var caseId = "case2", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].expression;

          sniff.run( rule, pNode );
          msg = mediator.getMessage( "OperatorTrailingWhitespaces" );
          msg.should.be.ok;
        });



        it("must not trigger on (1 + 1)", function () {
        var caseId = "case3", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].expression;

          sniff.run( rule, pNode );

          mediator.getMessages().should.not.be.ok;
        });

        it("must not trigger on (\"1\" + \"1\")", function () {
        var caseId = "case4", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].expression;

          sniff.run( rule, pNode );

          mediator.getMessages().should.not.be.ok;
        });

        it("must trigger violation on (1>>> 1)", function () {
        var caseId = "case1", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].expression;

          sniff.run( rule, pNode );
          msg = mediator.getMessage( "OperatorPrecedingWhitespaces" );
          msg.should.be.ok;
        });

      it("must trigger violation on (a= 1 + 1)", function () {
        var caseId = "case6", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].expression;

          sniff.run( rule, pNode );
          msg = mediator.getMessage( "OperatorPrecedingWhitespaces" );
          msg.should.be.ok;
        });

        it("must not trigger on (a = 1 + 1)", function () {
        var caseId = "case7", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].expression;

          sniff.run( rule, pNode );

          mediator.getMessages().should.not.be.ok;
        });


    });

});
