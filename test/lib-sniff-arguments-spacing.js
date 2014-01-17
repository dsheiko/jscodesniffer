/*jshint -W068 */
var
		/**
		 * @constant
		 * @type {string}
		 * @default
		 */
		TEST_SUITE_NAME = "ArgumentsSpacing",
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
      it("must throw exception when rule.allowArgPrecedingWhitespaces is not a number", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { allowArgPrecedingWhitespaces: true, allowArgTrailingWhitespaces: 1 } );
        }).should[ "throw" ]();
      });
      it("must throw exception when rule.allowArgTrailingWhitespaces is not a number", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { allowArgPrecedingWhitespaces: 1, allowArgTrailingWhitespaces: true } );
        }).should[ "throw" ]();
      });
        it("must throw exception when rule.exceptions is not valid", function () {
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
        }).should[ "throw" ]();
      });
    });
    /**
      * testing IfStatement
      */
    describe( "with jQuery ruleset", function () {
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

      it("must trigger no violation on a( 1, 1 )", function () {
          var caseId = "case1",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });

				 it("must trigger violation on a(       1, 1 )", function () {
          var caseId = "case14",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          msg = mediator.getMessage( "ArgPrecedingWhitespaces" );
					msg.should.be.ok;
        });

        it("must trigger violation on a(1, 1 )", function () {
          var caseId = "case2",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          msg = mediator.getMessage( "ArgPrecedingWhitespaces" );
					msg.range.should.eql([ 2, 2 ]);
					msg.loc.should.eql({
						start: {
							line: 1,
							column: 2
						},
						end: {
							line: 1,
							column: 2
						}
					});
          msg.should.be.ok;
        });

        it("must trigger violation on a( 1,1 )", function () {
          var caseId = "case3",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          msg = mediator.getMessage( "ArgPrecedingWhitespaces" );
					msg.range.should.eql([ 5, 5 ]);
					msg.loc.should.eql({
						start: {
							line: 1,
							column: 5
						},
						end: {
							line: 1,
							column: 5
						}
					});
          msg.should.be.ok;
        });
        it("must trigger violation on a( 1, 1)", function () {
          var caseId = "case4",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          msg = mediator.getMessage( "ArgTrailingWhitespaces" );
					msg.range.should.eql([ 7, 7 ]);
					msg.loc.should.eql({
						start: {
							line: 1,
							column: 7
						},
						end: {
							line: 1,
							column: 7
						}
					});
          msg.should.be.ok;
        });
        it("must trigger no violation on a( 1,.. 1..)", function () {
          var caseId = "case5",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });


        it("must trigger no violation on a({ p: 1 })", function () {
          var caseId = "case6",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });
        it("must trigger no violation on a([ 1 ])", function () {
          var caseId = "case7",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });
        it("must trigger no violation on a(function(){})", function () {
          var caseId = "case8",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });

        it("must trigger no violation on a(function(){}, 1 )", function () {
          var caseId = "case9",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });


        it("must trigger no violation on o.p( 1, 1 ).p( 1 )", function () {
          var caseId = "case11",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });

				it("must trigger no violation on fn( 1, bar( 1, 1 ) )", function () {
          var caseId = "case12",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });

				it("must trigger no violation on fn( 1, ( 1 ) )", function () {
          var caseId = "case12",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });


				it("getExpOpeningBrace must find opening brace on fn( 1, ( 1 ) )", function () {
          var caseId = "case13",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );

					sniff.getExpOpeningBrace( pNode ).range.should.eql([ 2, 3 ]);
        });

				it("getExpClosingBrace must find closing brace on fn( 1, ( 1 ) )", function () {
          var caseId = "case13",
							tree = helper.getTree( caseId );
          pNode = tree.body[ 0 ].expression;
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ),
						mediator, new TokenIteratorStub( tree.tokens ) );

					pNode.range, sniff.getExpClosingBrace( pNode ).range.should.eql([ 13, 14 ]);
        });

    });

});
