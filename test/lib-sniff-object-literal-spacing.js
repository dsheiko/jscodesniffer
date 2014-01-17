/*jshint -W068 */
var
		/**
		 * @constant
		 * @type {string}
		 * @default
		 */
		TEST_SUITE_NAME = "ObjectLiteralSpacing",
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
        sniff;
      beforeEach(function(){
        mediator = new MediatorMock();

      });

      it("must throw exception when rule.allowKeyPrecedingWhitespaces is not a number", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowKeyPrecedingWhitespaces": true }, null );
        }).should[ "throw" ]();
      });

      it("must throw exception when rule.allowKeyTrailingWhitespaces  is not a number", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowKeyTrailingWhitespaces": true }, null );
        }).should[ "throw" ]();
      });

      it("must throw exception when rule.allowValuePrecedingWhitespaces is not a number", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowValuePrecedingWhitespaces": true }, null );
        }).should[ "throw" ]();
      });

      it("must throw exception when rule.allowValueTrailingWhitespaces is not a number", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "allowValueTrailingWhitespaces": true }, null );
        }).should[ "throw" ]();
      });
    });
    /**
    * testing Cases
    */
    describe( "with key spacing 1,0 and value spacing 1,1", function () {
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


      it("must trigger no violation on o = { p: 1 }", function () {
        var caseId = "case1",
						tree = helper.getTree( caseId );

        pNode = tree
          .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
          mediator, new TokenIteratorStub( tree.tokens ) );
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });

      it("must trigger violation on o = {p: 1 }", function () {
        var caseId = "case2",
						tree = helper.getTree( caseId );
        pNode = tree
          .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
          mediator, new TokenIteratorStub( tree.tokens ) );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyKeyPrecedingSpacing" );
        msg.should.be.ok;
      });

      it("must trigger violation on o = { p : 1 }", function () {
        var caseId = "case3",
						tree = helper.getTree( caseId );
        pNode = tree
          .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
          mediator, new TokenIteratorStub( tree.tokens ) );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyKeyTrailingSpacing" );
        msg.should.be.ok;
      });

      it("must trigger violation on o = { p:1 }", function () {
        var caseId = "case4",
						tree = helper.getTree( caseId );
        pNode = tree
          .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
          mediator, new TokenIteratorStub( tree.tokens ) );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyValuePrecedingSpacing" );
        msg.should.be.ok;
      });
      it("must trigger violation on o = { p: 1}", function () {
        var caseId = "case5",
						tree = helper.getTree( caseId );
        pNode = tree
          .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
          mediator, new TokenIteratorStub( tree.tokens ) );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyValueTrailingSpacing" );
        msg.should.be.ok;
      });

      it("must trigger no violation on o = { p1: 1, p2: 2 }", function () {
        var caseId = "case6",
						tree = helper.getTree( caseId );
        pNode = tree
          .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
          mediator, new TokenIteratorStub( tree.tokens ) );
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
      it("must trigger no violation on o = {..p1: 1,..p2: 2..}", function () {
        var caseId = "case7",
						tree = helper.getTree( caseId );
        pNode = tree
          .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
          mediator, new TokenIteratorStub( tree.tokens ) );
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
      it("must trigger violation on o = {..p1: 1,..p2: 2}", function () {
        var caseId = "case8",
						tree = helper.getTree( caseId );
        pNode = tree
          .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
          mediator, new TokenIteratorStub( tree.tokens ) );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyValueTrailingSpacing" );
        msg.should.be.ok;
      });
      it("must trigger violation on o = {p1: 1,..p2: 2..}", function () {
        var caseId = "case9",
						tree = helper.getTree( caseId );
        pNode = tree
          .body[ 0 ].expression.right;
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
          mediator, new TokenIteratorStub( tree.tokens ) );
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "ObjectPropertyKeyPrecedingSpacing" );
        msg.should.be.ok;
      });


  });
});
