/*jshint -W068 */
var fixture = require("./inc/fixture"),
    MediatorMock = require("./inc/MediatorMock"),
    SourceCodeStub = require("./inc/SourceCodeStub"),
    sniffClass = require("../lib/Sniff/SyntaxTree/ChainedMethodCallsSpacing");


require("should");
describe( "ChainedMethodCallsSpacing", function () {
  var pNode = null,
      mediator,
      sniff,
      msg;

    beforeEach(function(){
      mediator = new MediatorMock();
      msg = false;
    });

    it("must throw exception when invalid rule.allowOnePerLineWhenMultilineCaller given", function () {
      sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
      (function(){
        sniff.run( { "allowOnePerLineWhenMultilineCaller": 1 }, null );
      }).should[ "throw" ]();
    });

    it("must trigger violation ", function () {
      var rule =  {
        "allowOnePerLineWhenMultilineCaller": true
      };
      sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ChainedMethodCallsSpacing/case2.js" )
        ), mediator );

      pNode = fixture.getJson( "ChainedMethodCallsSpacing/case2.json" ).body[ 0 ];
      sniff.run( rule, pNode.expression, pNode );
      msg = mediator.getMessage( "ChainedMethodCallsOnePerLine" );
      msg.should.be.ok;
    });

    it("must not trigger violation", function () {
      var rule =  {
        "allowOnePerLineWhenMultilineCaller": true
      };
      sniff = new sniffClass( new SourceCodeStub( fixture.getText( "ChainedMethodCallsSpacing/case1.js" )
        ), mediator );

      pNode = fixture.getJson( "ChainedMethodCallsSpacing/case1.json" ).body[ 0 ];
      sniff.run( rule, pNode.expression, pNode );
      mediator.getMessages().should.not.be.ok;
    });

});
