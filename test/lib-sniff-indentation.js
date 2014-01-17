/*jshint -W068 */
var fixture = require( "./inc/fixture" ),
    MediatorMock = require( "./inc/MediatorMock" ),
    SourceCodeStub = require( "./inc/SourceCodeStub" ),
    sniffClass = require( "../lib/Sniff/SourceCode/Indentation" );

require( "should" );
describe( "Indentation", function () {
  describe( "(Contract)", function () {
    var mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
      });
      it("must throw exception when invalid rule.allowOnlyTabs given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "allowOnlyTabs": 1 } );
        }).should[ "throw" ]();
      });
      it("must throw exception when invalid rule.allowOnlySpaces given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "allowOnlySpaces": 1 } );
        }).should[ "throw" ]();
      });
			it("must throw exception when invalid rule.disallowMixed given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "disallowMixed": 1 } );
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

      it("must trigger violation when only spaces allowed but tabs provided", function () {
        var caseId = "case1";

          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "Indentation/" + caseId + ".js" )
            ), mediator );

          sniff.run( { "allowOnlySpaces": true } );
          msg = mediator.getMessage( "OnlySpacesAllowedForIndentation" );
					msg.should.be.ok;
					msg.range.should.eql([ 0, 2 ]);
					msg.payload.actual.should.eql( "\t\t" );
					msg.payload.expected.should.eql( "spaces" );

        });

        it("must not trigger violation when only tabs allowed and tabs provided", function () {
        var caseId = "case1";

          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "Indentation/" + caseId + ".js" )
            ), mediator );

          sniff.run( { "allowOnlyTabs": true } );

          mediator.getMessages().should.not.be.ok;
        });

        it("must trigger violation when only tabs allowed but spaces provided", function () {
        var caseId = "case2";

          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "Indentation/" + caseId + ".js" )
            ), mediator );
          sniff.run( { "allowOnlyTabs": true } );
          msg = mediator.getMessage( "OnlyTabsAllowedForIndentation" );
          msg.should.be.ok;
					msg.range.should.eql([ 0, 4 ]);
					msg.payload.actual.should.eql( "    " );
					msg.payload.expected.should.eql( "tabs" );
        });

        it("must trigger violation when mixed spaces and tabs found and it is not alowed", function () {
        var caseId = "case3";
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "Indentation/" + caseId + ".js" )
            ), mediator );
          sniff.run( { "disallowMixed": true } );
					msg = mediator.getMessage( "MixedWhitespacesNotAllowedForIndentation" );
          msg.should.be.ok;
					msg.range.should.eql([ 0, 3 ]);
					msg.payload.actual.should.eql( " \t " );
					msg.payload.expected.should.eql( "any" );
					msg.loc.should.eql({
						start: {
							line: 1,
							column: 0
						},
						end: {
							line: 1,
							column: 3
						}
					});
        });


    });

});
