/*jshint -W068 */
var fixture = require( "./inc/fixture" ),
    MediatorMock = require( "./inc/MediatorMock" ),
    SourceCodeStub = require( "./inc/SourceCodeStub" ),
    sniffClass = require( "../lib/Sniff/Token/CommaPunctuatorSpacing" );

require( "should" );
describe( "CommaPunctuatorSpacing", function () {
  describe( "(Contract)", function () {
    var mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });
      it("must throw exception when invalid rule.disallowPrecedingSpaces given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "disallowPrecedingSpaces": 1 } );
        }).should[ "throw" ]();
      });
    });
    /**
      * cases
      */
    describe( "(cases)", function () {
      var token = null,
          mediator,
          msg,
          sniff,
          rule = { "disallowPrecedingSpaces": true };

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });

      it("must trigger violation", function () {
        var caseId = "case1";

          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CommaPunctuatorSpacing/" + caseId + ".js" )
            ), mediator );

          token = fixture.getJson( "CommaPunctuatorSpacing/" + caseId + ".json" );
          sniff.run( rule, token );
          msg = mediator.getMessage( "CommaPrecedingSpacesNotAllowed" );
          msg.should.be.ok;
          msg.range.should.eql([ 12, 13 ]);
          msg.loc.start.column.should.eql( 5 );
          msg.loc.end.column.should.eql( 6 );
        });

        it("must not trigger violation", function () {
        var caseId = "case2";

          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CommaPunctuatorSpacing/" + caseId + ".js" )
            ), mediator );

          token = fixture.getJson( "CommaPunctuatorSpacing/" + caseId + ".json" );
          sniff.run( rule, token );
          mediator.getMessages().should.not.be.ok;
        });
    });

});
