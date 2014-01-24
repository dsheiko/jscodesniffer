/*jshint -W068 */
var fixture = require( "./inc/fixture" ),
    sniffClass = require( "../lib/Sniff/SyntaxTree/NewExpressionCalleeNamingConventions" ),
		SourceCodeStub = require( "./inc/SourceCodeStub" ),
    MediatorMock = require( "./inc/MediatorMock" );

require( "should" );
describe( "NewExpressionCalleeNamingConventions", function () {

  describe( "(contract)", function () {
    var sniff,
        mediator;
      beforeEach(function(){
        mediator = new MediatorMock();
        sniff = new sniffClass( null, mediator );
      });

  it("must throw exception when invalid type of allowCase rule property given", function () {
        var rule =  {
              "allowCase": 0,
              "allowRepeating": true,
              "allowNumbers": true
            };
        (function(){
          sniff.validateRule( rule );
        }).should[ "throw" ]();
      });

      it("must throw exception when invalid type of allowRepeating rule property given", function () {
        var rule =  {
              "allowCase": [],
              "allowRepeating": 0,
              "allowNumbers": true
            };
        (function(){
          sniff.validateRule( rule );
        }).should[ "throw" ]();
      });

        it("must throw exception when invalid type of allowNumbers rule property given", function () {
        var rule =  {
              "allowCase": [],
              "allowRepeating": true,
              "allowNumbers": 0
            };
        (function(){
          sniff.validateRule( rule );
        }).should[ "throw" ]();
      });

  });

  describe( "(cases)", function () {
    var pNode = null,
        sniff,
        mediator;

      beforeEach(function(){
        mediator = new MediatorMock();
      });


			it("must not trigger violation ", function () {
        var rule =  {
              "allowCase": ["pascal"],
              "allowRepeating": true,
              "allowNumbers": true
            }, caseId = "case1";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NewExpressionCalleeNamingConventions/" + caseId + ".js" )
            ), mediator );

        pNode = fixture.getJson( "NewExpressionCalleeNamingConventions/case1.json" ).body[ 0 ].expression.right;
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });

      it("must trigger violation ", function () {
					var rule =  {
              "allowCase": ["pascal"],
              "allowRepeating": true,
              "allowNumbers": true
            }, msg, caseId = "case2";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NewExpressionCalleeNamingConventions/" + caseId + ".js" )
            ), mediator );
        pNode = fixture.getJson( "NewExpressionCalleeNamingConventions/case2.json" ).body[ 0 ].expression.right;
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "NewExpressionCalleeNamingConventions" );
        msg.should.be.ok;

      });




  });


});

