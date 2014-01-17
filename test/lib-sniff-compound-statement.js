/*jshint -W068 */
var
		/**
		 * @constant
		 * @type {string}
		 * @default
		 */
		TEST_SUITE_NAME = "CompoundStatementConventions",
		/** @type {helper} */
		helper = require( "./inc/helper" )( TEST_SUITE_NAME ),
		/** @type {MediatorMock} */
    MediatorMock = require( "./inc/MediatorMock" ),
		/** @type {SourceCodeStub} */
    SourceCodeStub = require( "./inc/SourceCodeStub" ),
		/** @type {Sniff/SyntaxTree/ArrayLiteralSpacing} */
    sniffClass = require( "../lib/Sniff/SyntaxTree/" + TEST_SUITE_NAME );


require( "should" );
describe( "CompoundStatementConventions", function () {
  describe( "(Contract)", function () {
    var mediator,
        sniff;

      beforeEach(function(){
        mediator = new MediatorMock();

      });

      /**
      * Testing contract
      */
      it("must throw exception when invalid rule.for given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "for": true, "requireBraces": true, "requireMultipleLines": true }, null );
        }).should[ "throw" ]();
      });
      it("must throw exception when invalid rule.requireBraces given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "for": [], "requireBraces": 1, "requireMultipleLines": true }, null );
        }).should[ "throw" ]();
      });
      it("must throw exception when invalid rule.requireMultipleLines given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "for": [], "requireBraces": true, "requireMultipleLines": 1 }, null );
        }).should[ "throw" ]();
      });
    });


    /**
      * testing IfStatement
      */
    describe( "with IfStatement", function () {
      var pNode = null,
          mediator,
          sniff,
          statement = "IfStatement";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

      it("must trigger violation on (if(1) a = 1;) when braces required", function () {
          var rule = {
								"for": [ statement ],
								"requireBraces": true,
								"requireMultipleLines": false
							},
							caseId = "case1.fail";
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );

          pNode = helper.getTree( caseId ).body[ 0 ];
          sniff.run( rule, pNode );
          mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
        });

        it("must trigger violation on (if(1) a = 1;) when multiple lines required", function () {
          var rule = {
								"for": [ statement ],
								"requireBraces": false,
								"requireMultipleLines": true
							},
							caseId = "case1.fail";
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );

          pNode = helper.getTree( caseId ).body[ 0 ];
          sniff.run( rule, pNode );
          mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
        });

        it("must not trigger violation on (if(1) {..}) when breaces and multiple lines required", function () {
          var rule = {
								"for": [ statement ],
								"requireBraces": true,
								"requireMultipleLines": true
							},
							caseId = "case1.ok";
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );

          pNode = helper.getTree( caseId ).body[ 0 ];
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });
      });

      /**
      * testing SwitchStatement
      */
    describe( "with SwitchStatement", function () {
      var pNode = null,
          mediator,
          sniff,
          statement = "SwitchStatement";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

      it("must trigger violation on (switch(true) {}) when multiple lines required", function () {
          var caseId = "case2.fail",
							rule = {
								"for": [ statement ],
								"requireBraces": true,
								"requireMultipleLines": true
							};
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );

          pNode = helper.getTree( caseId ).body[ 0 ];
          sniff.run( rule, pNode );
          mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
        });

        it("must not trigger violation on (switch(true) {...}) when multiple lines required", function () {
          var caseId = "case2.ok",
							rule = {
								"for": [ statement ],
								"requireBraces": true,
								"requireMultipleLines": true
							};
          sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );

          pNode = helper.getTree(  caseId ).body[ 0 ];
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;
        });
    });

  /**
  * testing WhileStatement
  */
  describe( "with WhileStatement", function () {
      var pNode = null,
          mediator,
          sniff,
          statement = "WhileStatement";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

    it("must trigger violation on (while (true) a = 1;) when braces required", function () {
        var caseId = "case3.fail",
						rule = {
							"for": [ statement ],
							"requireBraces": true,
							"requireMultipleLines": false
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );

        pNode = helper.getTree( caseId ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
      });

      it("must trigger violation on (while (true) a = 1;) when multiple lines required", function () {
        var caseId = "case3.fail",
						rule = {
							"for": [ statement ],
							"requireBraces": false,
							"requireMultipleLines": true
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId ) ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it("must not trigger violation on (while (true) {...}) when braces and multiple lines required", function () {
        var caseId = "case3.ok",
						rule = {
							"for": [ statement ],
							"requireBraces": true,
							"requireMultipleLines": true
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode( caseId  ) ), mediator );

        pNode = helper.getTree( caseId ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
    });



  /**
  * testing DoWhileStatement
  */
  describe( "with DoWhileStatement", function () {
      var pNode = null,
          mediator,
          sniff,
          statement = "DoWhileStatement";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

    it("must trigger violation on (do a++; while (true)) when braces required", function () {
        var caseId = "case4.fail",
						rule = {
							"for": [ statement ],
							"requireBraces": true,
							"requireMultipleLines": false
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
      });

      it("must trigger violation on (do a++; while (true)) when multiple lines required", function () {
        var caseId = "case4.fail",
						rule = {
							"for": [ statement ],
							"requireBraces": false,
							"requireMultipleLines": true
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it("must not trigger violation on (do {...} while (true)) when braces and multiple lines required", function () {
        var caseId = "case4.ok",
						rule = {
							"for": [ statement ],
							"requireBraces": true,
							"requireMultipleLines": true
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
  });


/**
  * testing ForStatement
  */
  describe( "with ForStatement", function () {
      var pNode = null,
          mediator,
          sniff,
          statement = "ForStatement";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

    it("must trigger violation on (for(;;) i++;) when braces required", function () {
        var caseId = "case5.fail",
						rule = {
							"for": [ statement ],
							"requireBraces": true,
							"requireMultipleLines": false
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
      });

      it("must trigger violation on (for(;;) i++;) when multiple lines required", function () {
        var caseId = "case5.fail",
				rule = {
          "for": [ statement ],
          "requireBraces": false,
          "requireMultipleLines": true
        };
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it("must not trigger violation on (for(;;) {...}) when braces and multiple lines required", function () {
        var caseId = "case5.ok",
						rule = {
							"for": [ statement ],
							"requireBraces": true,
							"requireMultipleLines": true
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
  });

  /**
  * testing ForStatement
  */
  describe( "with ForInStatement", function () {
      var pNode = null,
          mediator,
          sniff,
          statement = "ForInStatement";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

    it("must trigger violation on (for(p in o) i++;) when braces required", function () {
        var caseId = "case6.fail",
						rule = {
							"for": [ statement ],
							"requireBraces": true,
							"requireMultipleLines": false
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
      });

      it("must trigger violation on (for(p in o) i++;) when multiple lines required", function () {
        var caseId = "case6.fail",
						rule = {
							"for": [ statement ],
							"requireBraces": false,
							"requireMultipleLines": true
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it("must not trigger violation on (for(p in o) {...}) when braces and multiple lines required", function () {
        var caseId = "case6.ok",
						rule = {
							"for": [ statement ],
							"requireBraces": true,
							"requireMultipleLines": true
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
  });


  /**
  * testing WithStatement
  */
  describe( "with WithStatement", function () {
      var pNode = null,
          mediator,
          sniff,
          statement = "WithStatement";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

    it("must trigger violation on (with(o) i++;) when braces required", function () {
        var caseId = "case7.fail",
						rule = {
							"for": [ statement ],
							"requireBraces": true,
							"requireMultipleLines": false
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireBraces" ).should.be.ok;
      });

      it("must trigger violation on (with(o) i++;) when multiple lines required", function () {
        var caseId = "case7.fail",
						rule = {
							"for": [ statement ],
							"requireBraces": false,
							"requireMultipleLines": true
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it("must not trigger violation on (with(o) {...}) when braces and multiple lines required", function () {
        var caseId = "case7.ok",
						rule = {
							"for": [ statement ],
							"requireBraces": true,
							"requireMultipleLines": true
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
  });

  /**
  * testing TryStatement
  */
  describe( "with TryStatement", function () {
      var pNode = null,
          mediator,
          sniff,
          statement = "TryStatement";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

      it("must trigger violation on (try {} catch(e){}) when multiple lines required", function () {
        var caseId = "case8.fail",
						rule = {
							"for": [ statement ],
							"requireBraces": false,
							"requireMultipleLines": true
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "CompoundStatementRequireMultipleLines" ).should.be.ok;
      });

      it("must not trigger violation on (try {..} catch(e){}) when braces and multiple lines required", function () {
        var caseId = "case8.ok",
						rule = {
							"for": [ statement ],
							"requireBraces": true,
							"requireMultipleLines": true
						};
        sniff = new sniffClass( new SourceCodeStub( helper.getCode(  caseId )
          ), mediator );

        pNode = helper.getTree(  caseId  ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });
  });


});
