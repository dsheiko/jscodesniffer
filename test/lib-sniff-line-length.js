/*jshint -W068 */
var fixture = require( "./inc/fixture" ),
    MediatorMock = require( "./inc/MediatorMock" ),
    SourceCodeStub = require( "./inc/SourceCodeStub" ),
    sniffClass = require( "../lib/Sniff/SourceCode/LineLength" );

require( "should" );
describe( "LineLength", function () {
  describe( "(Contract)", function () {
    var mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });
      it("must throw exception when invalid rule.allowMaxLength given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "allowMaxLength": false } );
        }).should[ "throw" ]();
      });
      it("must throw exception when invalid rule.allowMinLength given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "allowMinLength": false } );
        }).should[ "throw" ]();
      });
    });
    /**
      * cases
      */
    describe( "(cases)", function () {
      var mediator,
          msg,
          sniff;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });

      it("must trigger violation when a line is too long", function () {
        var caseId = "case1";

          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "LineLength/" + caseId + ".js" )
            ), mediator );

          sniff.run( { "allowMaxLength": 30 } );
          msg = mediator.getMessage( "ExceededLineMaxLength" );
          msg.should.be.ok;
        });

        it("must trigger violation when a line is too short", function () {
        var caseId = "case1";

          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "LineLength/" + caseId + ".js" )
            ), mediator );

          sniff.run( { "allowMinLength": 45 } );
          msg = mediator.getMessage( "DeceedLineMinLength" );
          msg.should.be.ok;
        });

        it("must not trigger violation", function () {
        var caseId = "case1";

          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "LineLength/" + caseId + ".js" )
            ), mediator );

          sniff.run( { "allowMaxLength": 80 } );

          mediator.getMessages().should.not.be.ok;
        });
    });

});
