/*jshint -W068 */
var
		/**
		 * @constant
		 * @type {string}
		 * @default
		 */
		TEST_SUITE_NAME = "UnaryExpressionIdentifierSpacing",
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
  var mediator,
      sniff,
      msg;

    beforeEach(function(){
      mediator = new MediatorMock();
      msg = false;
    });

		describe( " ( Contract ) ", function() {
			it("must throw exception when invalid rule.allowTrailingWhitespaces given", function () {
				sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
				(function(){
					sniff.run( { "allowTrailingWhitespaces": true }, null );
				}).should[ "throw" ]();
			});
		});
		describe( " ( cases ) ", function() {
			it("must trigger violation on (! a;) when no unary exp. preceding spaces allowed", function () {
				var rule =  {
							"allowTrailingWhitespaces": 0
						},
						caseId = "case1",
						tree = helper.getTree( caseId );

				sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );

				sniff.run( rule, tree.body[ 0 ].expression );
				msg = mediator.getMessage( "UnaryExpressionValueTrailingSpacing" );
				msg.should.be.ok;
				msg.payload.actual.should.eql( 1 );
				msg.payload.expected.should.eql( 0 );
			});

			it("must not trigger violation on (!a;) when no unary exp. preceding spaces allowed", function () {
				var rule =  {
							"allowTrailingWhitespaces": 0
						},
						caseId = "case2",
						tree = helper.getTree( caseId );

				sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );

				sniff.run( rule, tree.body[ 0 ].expression );
				mediator.getMessages().should.not.be.ok;
			});
		});

});
