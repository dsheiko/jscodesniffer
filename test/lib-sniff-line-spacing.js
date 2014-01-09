/*jshint -W068 */
var fixture = require( "./inc/fixture" ),
    MediatorMock = require( "./inc/MediatorMock" ),
    SourceCodeStub = require( "./inc/SourceCodeStub" ),
    sniffClass = require( "../lib/Sniff/SourceCode/LineSpacing" );

require( "should" );
describe( "LineSpacing", function () {
  describe( "(Contract)", function () {
    var mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });
      it("must throw exception when invalid rule.allowLineTrailingSpaces given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "allowLineTrailingSpaces": 1 } );
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
          rule = { "allowLineTrailingSpaces": false };

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });

      it("must trigger violation", function () {
        var caseId = "case1";

          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "LineSpacing/" + caseId + ".js" )
            ), mediator );

          sniff.run( rule );
          msg = mediator.getMessage( "LineTrailingSpacesNotAllowed" );
          msg.should.be.ok;
          msg.range.should.eql([ 6, 7 ]);
        });

        it("must not trigger violation", function () {
        var caseId = "case2";

          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "LineSpacing/" + caseId + ".js" )
            ), mediator );

          sniff.run( rule );
          mediator.getMessages().should.not.be.ok;
        });
    });

});
