/*jshint -W068 */
var
		/**
		 * @constant
		 * @type {string}
		 * @default
		 */
		TEST_SUITE_NAME = "ArrayLiteralConventions",
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
      it("must throw exception when invalid rule.requireOnePerLineWhenMultiline given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "requireOnePerLineWhenMultiline" : 1 } );
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
            "requireOnePerLineWhenMultiline": true
          };

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });

      it("must not trigger violation on entirely inline declaration", function () {
        var caseId = "case1", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].declarations[ 0 ].init;
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });

				it("must not trigger violation on consistently multiline declaration", function () {
        var caseId = "case2", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].declarations[ 0 ].init;
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });

				it("must trigger violation on inconsistent declaration", function () {
        var caseId = "case3", tree = helper.getTree( caseId ), pNode;

          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
            mediator, new TokenIteratorStub( tree.tokens ) );

          pNode = tree.body[ 0 ].declarations[ 0 ].init;
          sniff.run( rule, pNode );
					mediator.getMessage( "ArrayDeclarationRequireOnePerLineWhenMultiline" ).should.be.ok;
        });

    });

});
