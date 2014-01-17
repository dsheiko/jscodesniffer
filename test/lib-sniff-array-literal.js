/*jshint -W068 */
var
		/**
		 * @constant
		 * @type {string}
		 * @default
		 */
		TEST_SUITE_NAME = "ArrayLiteralSpacing",
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

      it("must throw exception when rule.allowElementPrecedingWhitespaces is not a number", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowElementPrecedingWhitespaces": "", "allowElementTrailingWhitespaces": 1 }, null );
        }).should[ "throw" ]();
      });
      it("must throw exception when rule.allowElementTrailingWhitespaces  is not a number", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowElementPrecedingWhitespaces": 1, "allowElementTrailingWhitespaces": false }, null );
        }).should[ "throw" ]();
      });
    });

    /**
      * testing Cases
      */
    describe( "with left spaces = 1, right spaces = 1", function () {
      var mediator,
          msg,
          sniff,
          rule = { "allowElementPrecedingWhitespaces": 1, "allowElementTrailingWhitespaces": 1 };

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });

      it("must not trigger violation on [ 1, 1 ]", function () {
          var caseId = "case1",
							tree = helper.getTree( caseId );
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator,
						new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, tree.body[ 0 ].expression );
          mediator.getMessages().should.not.be.ok;
			});
			it("must trigger violation on [1, 1 ]", function () {
          var caseId = "case2",
							tree = helper.getTree( caseId );
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator,
						new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, tree.body[ 0 ].expression );
          mediator.getMessage( "ArraylElementPrecedingSpacing" ).should.be.ok;
			});
			it("must trigger violation on [ 1,1 ]", function () {
          var caseId = "case3",
							tree = helper.getTree( caseId );
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator,
						new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, tree.body[ 0 ].expression );
          mediator.getMessage( "ArraylElementPrecedingSpacing" ).should.be.ok;
			});
			it("must trigger violation on [ 1, 1]", function () {
          var caseId = "case4",
							tree = helper.getTree( caseId );
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator,
						new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, tree.body[ 0 ].expression );
          mediator.getMessage( "ArraylElementTrailingSpacing" ).should.be.ok;
			});
			it("must not trigger violation on [\\n 1,\\n 1\\n]", function () {
          var caseId = "case5",
							tree = helper.getTree( caseId );
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator,
						new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, tree.body[ 0 ].expression );
          mediator.getMessages().should.not.be.ok;
			});
			it("must not trigger violation on [1,\\n  1\\n]", function () {
          var caseId = "case6",
							tree = helper.getTree( caseId );
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator,
						new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, tree.body[ 0 ].expression );
          mediator.getMessage( "ArraylElementPrecedingSpacing" ).should.be.ok;
			});
			it("must not trigger violation on [\\n1,\\n  1]", function () {
          var caseId = "case7",
							tree = helper.getTree( caseId );
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator,
						new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, tree.body[ 0 ].expression );
          mediator.getMessage( "ArraylElementTrailingSpacing" ).should.be.ok;
			});

    });

});
