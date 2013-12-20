var should = require('should'),
    fixture = require('./inc/fixture'),
    locEntity = require('./inc/LocEntity'),
    MediatorMock = require('./inc/MediatorMock'),
    SourceCodeStub = require('./inc/SourceCodeStub'),
    sniffClass = require('../lib/Sniff/SourceCode/Indentation');


describe('Indentation', function () {
  describe('(Contract)', function () {
    var mediator,
        sniff,
        msg;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
     });
     it('must throw exception when invalid rule.allowOnlyTabs given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "allowOnlyTabs": 1 } );
        }).should.throw();
      });
      it('must throw exception when invalid rule.allowOnlySpaces given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validate( { "allowOnlySpaces": 1 } );
        }).should.throw();
      });
    });
    /**
     * cases
     */
    describe('(cases)', function () {
      var mediator,
          msg,
          sniff;

      beforeEach(function(){
        mediator = new MediatorMock();
        msg = false;
     });

      it('must trigger violation when only spaces allowed but tabs provided', function () {
        var caseId = "case1";

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "Indentation/" + caseId + ".js" )
           ), mediator );

         sniff.run( { "allowOnlySpaces": true } );
         msg = mediator.getMessage( "OnlySpacesAllowedForIndentation" );
         msg.should.be.ok;
       });

       it('must not trigger violation when only tabs allowed and tabs provided', function () {
        var caseId = "case1";

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "Indentation/" + caseId + ".js" )
           ), mediator );

         sniff.run( { "allowOnlyTabs": true } );

         mediator.getMessages().should.not.be.ok;
       });

       it('must trigger violation when only tabs allowed but spaces provided', function () {
        var caseId = "case2";

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "Indentation/" + caseId + ".js" )
           ), mediator );
         sniff.run( { "allowOnlyTabs": true } );
         msg = mediator.getMessage( "OnlyTabsAllowedForIndentation" );
         msg.should.be.ok;
       });

       it('must not trigger violation when only spaces allowed and spaces provided', function () {
        var caseId = "case2";

         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "Indentation/" + caseId + ".js" )
           ), mediator );
         sniff.run( { "allowOnlySpaces": true } );
         mediator.getMessages().should.not.be.ok;
       });


    });

});
