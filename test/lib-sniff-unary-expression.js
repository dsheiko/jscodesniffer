var should = require('should'),
    fixture = require('./inc/fixture'),
    locEntity = require('./inc/LocEntity'),
    MediatorMock = require('./inc/MediatorMock'),
    SourceCodeStub = require('./inc/SourceCodeStub'),
    sniffClass = require('../lib/Sniff/SyntaxTree/UnaryExpressionIdentifierSpacing');



describe('UnaryExpressionIdentifierSpacing', function () {
  var pNode = null,
      mediator,
      sniff,
      msg;

    beforeEach(function(){
      mediator = new MediatorMock();
      msg = false;
   });

   it('must trigger violation on (! a;) when no unary exp. preceding spaces allowed', function () {
      var rule =  {
        "allowTrailingWhitespaces": 0
      };
      sniff = new sniffClass( new SourceCodeStub( fixture.getText( "UnaryExpressionIdentifierSpacing/case1.js" )
        ), mediator );

      pNode = fixture.getJson( "UnaryExpressionIdentifierSpacing/case1.json" ).body[ 0 ].expression;
      sniff.run( rule, pNode );
      msg = mediator.getMessage( "UnaryExpressionValueTrailingSpacing" );
      msg.should.be.ok;
      msg.payload.actual.should.eql( 1 );
      msg.payload.expected.should.eql( 0 );
    });

    it('must throw exception when invalid rule.allowTrailingWhitespaces given', function () {
      sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
      (function(){
        sniff.run( { "allowTrailingWhitespaces": true }, null );
      }).should[ "throw" ]();
    });

    it('must not trigger violation on (!a;) when no unary exp. preceding spaces allowed', function () {
      var rule =  {
        "allowTrailingWhitespaces": 0
      };
      sniff = new sniffClass( new SourceCodeStub( fixture.getText( "UnaryExpressionIdentifierSpacing/case2.js" )
        ), mediator );

      pNode = fixture.getJson( "UnaryExpressionIdentifierSpacing/case2.json" ).body[ 0 ].expression;
      sniff.run( rule, pNode );
      mediator.getMessages().should.not.be.ok;
    });

});
