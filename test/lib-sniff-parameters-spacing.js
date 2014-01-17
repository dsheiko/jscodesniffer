/*jshint -W068 */
var
		/**
		 * @constant
		 * @type {string}
		 * @default
		 */
		TEST_SUITE_NAME = "ParametersSpacing",
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
      it("must throw exception when rule.allowParamPrecedingWhitespaces is not a number", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowParamPrecedingWhitespaces": true, "allowParamTrailingWhitespaces": 1 } );
        }).should[ "throw" ]();
      });
      it("must throw exception when rule.allowParamTrailingWhitespaces is not a number", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowParamPrecedingWhitespaces": 1, "allowParamTrailingWhitespaces": true} );
        }).should[ "throw" ]();
      });
    });
    /**
      * testing cases
      */
    describe( "with left spaces = 1, right spaces = 1", function () {
      var mediator,
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

      it("must trigger no violation on foo = function( a, b ) {}", function () {
          var caseId = "case1", tree = helper.getTree( caseId ), pNode =  tree.body[ 0 ].expression.right;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });

        it("must trigger violation on foo = function(a, b ) {}", function () {
          var caseId = "case2",  tree = helper.getTree( caseId ), pNode =  tree.body[ 0 ].expression.right;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          msg = mediator.getMessage( "ParamPrecedingWhitespaces" );
          msg.should.be.ok;
        });

        it("must trigger violation on foo = function( a,b ) {}", function () {
          var caseId = "case3",  tree = helper.getTree( caseId ), pNode =  tree.body[ 0 ].expression.right;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          msg = mediator.getMessage( "ParamPrecedingWhitespaces" );
          msg.should.be.ok;
        });

        it("must trigger violation on foo = function( a, b) {}", function () {
          var caseId = "case4",  tree = helper.getTree( caseId ), pNode =  tree.body[ 0 ].expression.right;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          msg = mediator.getMessage( "ParamTrailingWhitespaces" );
          msg.should.be.ok;
        });

        it("must trigger no violation on foo = function( a,.. b.. ) {}", function () {
          var caseId = "case5",  tree = helper.getTree( caseId ), pNode =  tree.body[ 0 ].expression.right;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });

        it("must trigger violation on foo = function(a,..b ) {}", function () {
          var caseId = "case6",  tree = helper.getTree( caseId ), pNode =  tree.body[ 0 ].expression.right;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          msg = mediator.getMessage( "ParamPrecedingWhitespaces" );
          msg.should.be.ok;
        });


    });

});
