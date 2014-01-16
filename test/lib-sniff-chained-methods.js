/*jshint -W068 */
var fixture = require( "./inc/fixture" ),
    MediatorMock = require( "./inc/MediatorMock" ),
    SourceCodeStub = require( "./inc/SourceCodeStub" ),
		TokenIteratorStub = require( "./inc/TokenIteratorStub" ),
    ChainedMethodCallsPerLineConventions = require( "../lib/Sniff/SyntaxTree/ChainedMethodCallsPerLineConventions" ),
		ChainedMethodCallsSpacing = require( "../lib/Sniff/SyntaxTree/ChainedMethodCallsSpacing" );


require( "should" );

describe( "ChainedMethodCallsPerLineConventions", function () {
  var pNode = null,
      mediator,
      sniff,
      msg;

    beforeEach(function(){
      mediator = new MediatorMock();
      msg = false;
    });

    it("must throw exception when invalid rule.requireOnePerLineWhenMultilineCaller given", function () {
      sniff = new ChainedMethodCallsPerLineConventions( new SourceCodeStub( "code" ), mediator );
      (function(){
        sniff.run( { "requireOnePerLineWhenMultilineCaller": 1 }, null );
      }).should[ "throw" ]();
    });

    it("must trigger violation ", function () {
      var rule =  {
        "requireOnePerLineWhenMultilineCaller": true
      }, tree = fixture.getJson( "ChainedMethodCallsPerLineConventions/case2.json" );
      sniff = new ChainedMethodCallsPerLineConventions(
					new SourceCodeStub( fixture.getText( "ChainedMethodCallsPerLineConventions/case2.js" )
				), mediator, new TokenIteratorStub( tree.tokens )  );

      pNode = tree.body[ 0 ];
      sniff.run( rule, pNode.expression, pNode );
      msg = mediator.getMessage( "ChainedMethodCallsOnePerLine" );
      msg.should.be.ok;
    });

    it("must not trigger violation", function () {
      var rule =  {
        "requireOnePerLineWhenMultilineCaller": true
      }, tree = fixture.getJson( "ChainedMethodCallsPerLineConventions/case1.json" );
      sniff = new ChainedMethodCallsPerLineConventions( new SourceCodeStub(
						fixture.getText( "ChainedMethodCallsPerLineConventions/case1.js" )
        ), mediator, new TokenIteratorStub( tree.tokens )  );

      pNode = tree.body[ 0 ];
      sniff.run( rule, pNode.expression, pNode );
      mediator.getMessages().should.not.be.ok;
    });

});

describe( "ChainedMethodCallsSpacing", function () {
  var pNode = null,
      mediator,
      sniff,
      msg;

    beforeEach(function(){
      mediator = new MediatorMock();
      msg = false;
    });

    it("must throw exception when invalid rule.allowPrecedingPropertyWhitespaces given", function () {
      sniff = new ChainedMethodCallsSpacing( new SourceCodeStub( "code" ), mediator );
      (function(){
        sniff.run( { "allowPrecedingPropertyWhitespaces": "string" }, null );
      }).should[ "throw" ]();
    });

    it("must trigger violation ", function () {
      var rule =  {
        "allowPrecedingPropertyWhitespaces": 0
      }, tree = fixture.getJson( "ChainedMethodCallsSpacing/case2.json" );

      sniff = new ChainedMethodCallsSpacing(
					new SourceCodeStub( fixture.getText( "ChainedMethodCallsSpacing/case2.js" )
				), mediator, new TokenIteratorStub( tree.tokens )  );

      pNode = tree.body[ 0 ].expression;
      sniff.run( rule, pNode.callee, pNode );
      msg = mediator.getMessage( "ChainedMethodCallsPrecedingPropertyWhitespaces" );
      msg.should.be.ok;
    });

    it("must not trigger violation", function () {
      var rule =  {
        "allowPrecedingPropertyWhitespaces": 0
      }, tree = fixture.getJson( "ChainedMethodCallsSpacing/case1.json" );
      sniff = new ChainedMethodCallsSpacing( new SourceCodeStub( fixture.getText( "ChainedMethodCallsSpacing/case1.js" )
        ), mediator, new TokenIteratorStub( tree.tokens )  );

      pNode = tree.body[ 0 ].expression;
      sniff.run( rule, pNode.callee, pNode );
      mediator.getMessages().should.not.be.ok;
    });

});
