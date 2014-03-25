/*jshint -W068 */
var
		/**
		 * @constant
		 * @type {string}
		 * @default
		 */
		TEST_SUITE_NAME = "CallExpressionArgumentListSpacing",
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
    /**
      * cases
      */
    describe( "(cases)", function () {
      var mediator,
          msg,
          sniff,
          rule = {
            "allowTrailingWhitespaces": 1,
            "allowPrecedingWhitespaces": 1
          };

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });

      it("must trigger violation on foo( a )", function () {
        var caseId = "case1", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].expression;
          sniff.run( rule, pNode );
          msg = mediator.getMessage( "CallExpressionArgumentListPrecedingSpacing" );
          msg.should.be.ok;
        });

				it("must trigger violation on foo    ( a )", function () {
        var caseId = "case2", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].expression;
          sniff.run( rule, pNode );
          msg = mediator.getMessage( "CallExpressionArgumentListPrecedingSpacing" );
          msg.should.be.ok;
        });


    });

});
