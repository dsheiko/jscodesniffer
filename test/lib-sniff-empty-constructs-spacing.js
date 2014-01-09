/*jshint -W068 */
var fixture = require( "./inc/fixture" ),
    MediatorMock = require( "./inc/MediatorMock" ),
    SourceCodeStub = require( "./inc/SourceCodeStub" ),
    sniffClass = require( "../lib/Sniff/SyntaxTree/EmptyConstructsSpacing" );

require( "should" );
describe( "EmptyConstructsSpacing", function () {
  describe( "(Contract)", function () {
    var mediator,
        sniff;

      beforeEach(function(){
        mediator = new MediatorMock();

      });
      it("must throw exception when invalid rule.allowWhitespaces given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "for": [], "allowWhitespaces": 0  }, null );
        }).should[ "throw" ]();
      });
      it("must throw exception when invalid rule.for given", function () {
        sniff = new sniffClass( new SourceCodeStub( "code" ), mediator );
        (function(){
          sniff.validateRule( { "for": 1, "allowWhitespaces": true  }, null );
        }).should[ "throw" ]();
      });
    });
    /**
      * testing ArrayExpression
      */
    describe( "with ArrayExpression", function () {
      var pNode = null,
          mediator,

          sniff,
          statement = "ArrayExpression",
          caseId = "case1";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

      it("must not trigger violation on (a = []) when no spaces allowed", function () {
          var rule = {
            "for": [ statement ],
            "allowWhitespaces": false
          };
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "EmptyConstructsSpacing/" + caseId + ".ok.js" )
            ), mediator );

          pNode = fixture.getJson( "EmptyConstructsSpacing/" + caseId + ".ok.json" ).body[ 0 ].expression.right;
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;

        });
        it("must trigger violation on (a = [ ]) when no spaces allowed", function () {
          var rule = {
            "for": [ statement ],
            "allowWhitespaces": false
          };
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "EmptyConstructsSpacing/" + caseId + ".fail.js" )
            ), mediator );

          pNode = fixture.getJson( "EmptyConstructsSpacing/" + caseId + ".fail.json" ).body[ 0 ].expression.right;
          sniff.run( rule, pNode );
          mediator.getMessage( "EmptyConstructsSpacing" ).should.be.ok;
        });

    });

    /**
      * testing ObjectExpression
      */
    describe( "with ObjectExpression", function () {
      var pNode = null,
          mediator,

          sniff,
          statement = "ObjectExpression",
          caseId = "case2";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

      it("must not trigger violation on (a = {}) when no spaces allowed", function () {
          var rule = {
            "for": [ statement ],
            "allowWhitespaces": false
          };
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "EmptyConstructsSpacing/" + caseId + ".ok.js" )
            ), mediator );

          pNode = fixture.getJson( "EmptyConstructsSpacing/" + caseId + ".ok.json" ).body[ 0 ].expression.right;
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;

        });
        it("must trigger violation on (a = { }) when no spaces allowed", function () {
          var rule = {
            "for": [ statement ],
            "allowWhitespaces": false
          };
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "EmptyConstructsSpacing/" + caseId + ".fail.js" )
            ), mediator );

          pNode = fixture.getJson( "EmptyConstructsSpacing/" + caseId + ".fail.json" ).body[ 0 ].expression.right;
          sniff.run( rule, pNode );
          mediator.getMessage( "EmptyConstructsSpacing" ).should.be.ok;
        });

    });

    /**
      * testing BlockStatement
      */
/*
 *  @TODO: can contain inline comments
 *  
    describe( "with BlockStatement", function () {
      var pNode = null,
          mediator,

          sniff,
          statement = "BlockStatement",
          caseId = "case3";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

      it("must not trigger violation on ({}) when no spaces allowed", function () {
          var rule = {
            "for": [ statement ],
            "allowWhitespaces": false
          };
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "EmptyConstructsSpacing/" + caseId + ".ok.js" )
            ), mediator );

          pNode = fixture.getJson( "EmptyConstructsSpacing/" + caseId + ".ok.json" ).body[ 0 ];
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;

        });
        it("must trigger violation on ({ }) when no spaces allowed", function () {
          var rule = {
            "for": [ statement ],
            "allowWhitespaces": false
          };
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "EmptyConstructsSpacing/" + caseId + ".fail.js" )
            ), mediator );

          pNode = fixture.getJson( "EmptyConstructsSpacing/" + caseId + ".fail.json" ).body[ 0 ];
          sniff.run( rule, pNode );
          mediator.getMessage( "EmptyConstructsSpacing" ).should.be.ok;
        });

    });
*/
    /**
      * testing CallExpression
      */
    describe( "with CallExpression", function () {
      var pNode = null,
          mediator,

          sniff,
          statement = "CallExpression",
          caseId = "case4";

      beforeEach(function(){
        mediator = new MediatorMock();

      });

      it("must not trigger violation on (a = a()) when no spaces allowed", function () {
          var rule = {
            "for": [ statement ],
            "allowWhitespaces": false
          };
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "EmptyConstructsSpacing/" + caseId + ".ok.js" )
            ), mediator );

          pNode = fixture.getJson( "EmptyConstructsSpacing/" + caseId + ".ok.json" ).body[ 0 ].expression.right;
          sniff.run( rule, pNode );
          mediator.getMessages().should.not.be.ok;

        });
        it("must trigger violation on (a = a( )) when no spaces allowed", function () {
          var rule = {
            "for": [ statement ],
            "allowWhitespaces": false
          };
          sniff = new sniffClass( new SourceCodeStub( fixture.getText( "EmptyConstructsSpacing/" + caseId + ".fail.js" )
            ), mediator );

          pNode = fixture.getJson( "EmptyConstructsSpacing/" + caseId + ".fail.json" ).body[ 0 ].expression.right;
          sniff.run( rule, pNode );
          mediator.getMessage( "EmptyConstructsSpacing" ).should.be.ok;
        });

    });



});
