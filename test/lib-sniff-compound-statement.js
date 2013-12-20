var should = require('should'),
    fixture = require('./inc/fixture'),
    locEntity = require('./inc/LocEntity'),
    MediatorMock = require('./inc/MediatorMock'),
    SourceCodeStub = require('./inc/SourceCodeStub'),
    sniffClass = require('../lib/Sniff/SyntaxTree/CompoundStatementConventions');


describe('CompoundStatementConventions', function () {
  describe('(Contract)', function () {
    var pNode = null,
        mediator,
        sniff;

      beforeEach(function(){
        mediator = new MediatorMock();

     });

     /**
      * Testing contract
      */
     it('must throw exception when invalid rule.for given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "for": true, "requireBraces": true, "requireMultipleLines": true }, null );
        }).should.throw();
      });
      it('must throw exception when invalid rule.requireBraces given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "for": [], "requireBraces": 1, "requireMultipleLines": true }, null );
        }).should.throw();
      });
      it('must throw exception when invalid rule.requireMultipleLines given', function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "for": [], "requireBraces": true, "requireMultipleLines": 1 }, null );
        }).should.throw();
      });
    });


    /**
     * testing IfStatement
     */
    describe('with IfStatement', function () {
      var pNode = null,
          mediator,
          sniff,
          statement = "IfStatement",
          caseId = "case1";

      beforeEach(function(){
        mediator = new MediatorMock();

     });

      it('must trigger violation on (if(1) a = 1;) when braces required', function () {
         var rule = {
           "for": [ statement ],
           "requireBraces": true,
           "requireMultipleLines": false
         };
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
           ), mediator );

         pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
         sniff.run( rule, pNode );
         mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
       });

       it('must trigger violation on (if(1) a = 1;) when multiple lines required', function () {
         var rule = {
           "for": [ statement ],
           "requireBraces": false,
           "requireMultipleLines": true
         };
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
           ), mediator );

         pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
         sniff.run( rule, pNode );
         mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
       });

       it('must not trigger violation on (if(1) {..}) when breaces and multiple lines required', function () {
         var rule = {
           "for": [ statement ],
           "requireBraces": true,
           "requireMultipleLines": true
         };
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".ok.js" )
           ), mediator );

         pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".ok.json" ).body[ 0 ];
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });
      });

     /**
     * testing SwitchStatement
     */
    describe('with SwitchStatement', function () {
      var pNode = null,
          mediator,

          sniff,
          statement = "SwitchStatement",
          caseId = "case2";

      beforeEach(function(){
        mediator = new MediatorMock();

     });

      it('must trigger violation on (switch(true) {}) when multiple lines required', function () {
         var rule = {
           "for": [ statement ],
           "requireBraces": true,
           "requireMultipleLines": true
         };
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
           ), mediator );

         pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
         sniff.run( rule, pNode );
         mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
       });

       it('must not trigger violation on (switch(true) {...}) when multiple lines required', function () {
         var rule = {
           "for": [ statement ],
           "requireBraces": true,
           "requireMultipleLines": true
         };
         sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".ok.js" )
           ), mediator );

         pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".ok.json" ).body[ 0 ];
         sniff.run( rule, pNode );
         mediator.getMessages().should.not.be.ok;
       });
    });

  /**
  * testing WhileStatement
  */
 describe('with WhileStatement', function () {
      var pNode = null,
          mediator,

          sniff,
          statement = "WhileStatement",
          caseId = "case3";

      beforeEach(function(){
        mediator = new MediatorMock();

     });

    it('must trigger violation on (while (true) a = 1;) when braces required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": true,
          "requireMultipleLines": false
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
      });

     it('must trigger violation on (while (true) a = 1;) when multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": false,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it('must not trigger violation on (while (true) {...}) when braces and multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": true,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".ok.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".ok.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
    });



  /**
  * testing DoWhileStatement
  */
 describe('with DoWhileStatement', function () {
      var pNode = null,
          mediator,

          sniff,
          statement = "DoWhileStatement",
          caseId = "case4";

      beforeEach(function(){
        mediator = new MediatorMock();

     });

    it('must trigger violation on (do a++; while (true)) when braces required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": true,
          "requireMultipleLines": false
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
      });

     it('must trigger violation on (do a++; while (true)) when multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": false,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it('must not trigger violation on (do {...} while (true)) when braces and multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": true,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".ok.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".ok.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
  });


/**
  * testing ForStatement
  */
 describe('with ForStatement', function () {
      var pNode = null,
          mediator,

          sniff,
          statement = "ForStatement",
          caseId = "case5";

      beforeEach(function(){
        mediator = new MediatorMock();

     });

    it('must trigger violation on (for(;;) i++;) when braces required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": true,
          "requireMultipleLines": false
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
      });

     it('must trigger violation on (for(;;) i++;) when multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": false,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it('must not trigger violation on (for(;;) {...}) when braces and multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": true,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".ok.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".ok.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
  });

  /**
  * testing ForStatement
  */
 describe('with ForInStatement', function () {
      var pNode = null,
          mediator,

          sniff,
          statement = "ForInStatement",
          caseId = "case6";

      beforeEach(function(){
        mediator = new MediatorMock();

     });

    it('must trigger violation on (for(p in o) i++;) when braces required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": true,
          "requireMultipleLines": false
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
      });

     it('must trigger violation on (for(p in o) i++;) when multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": false,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it('must not trigger violation on (for(p in o) {...}) when braces and multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": true,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".ok.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".ok.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
  });


  /**
  * testing WithStatement
  */
 describe('with WithStatement', function () {
      var pNode = null,
          mediator,

          sniff,
          statement = "WithStatement",
          caseId = "case7";

      beforeEach(function(){
        mediator = new MediatorMock();

     });

    it('must trigger violation on (with(o) i++;) when braces required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": true,
          "requireMultipleLines": false
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
      });

     it('must trigger violation on (with(o) i++;) when multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": false,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it('must not trigger violation on (with(o) {...}) when braces and multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": true,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".ok.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".ok.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
  });

  /**
  * testing TryStatement
  */
 describe('with TryStatement', function () {
      var pNode = null,
          mediator,

          sniff,
          statement = "TryStatement",
          caseId = "case8";

      beforeEach(function(){
        mediator = new MediatorMock();

     });


     it('must trigger violation on (try {} catch(e){}) when multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": false,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".fail.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".fail.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it('must not trigger violation on (try {..} catch(e){}) when braces and multiple lines required', function () {
        var rule = {
          "for": [ statement ],
          "requireBraces": true,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( fixture.getText( "CompoundStatementConventions/" + caseId + ".ok.js" )
          ), mediator );

        pNode = fixture.getJson( "CompoundStatementConventions/" + caseId + ".ok.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
  });


});
