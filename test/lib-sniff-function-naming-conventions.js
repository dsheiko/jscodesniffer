/*jshint -W068 */
var fixture = require( "./inc/fixture" ),
    locEntity = require( "./inc/LocEntity" ),
		SourceCodeStub = require( "./inc/SourceCodeStub" ),
    sniffClass = require( "../lib/Sniff/SyntaxTree/FunctionNamingConventions" ),
    MediatorMock = require( "./inc/MediatorMock" );

require( "should" );
describe( "FunctionNamingConventions", function () {

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

      it("must trigger violation when camelcase expected, but pascal case found (function Invalid() {})", function () {
        var rule =  {
              "allowCase": ["camel"],
              "allowRepeating": true,
              "allowNumbers": true
            }, msg, caseId = "case21";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NamingConventions/" + caseId + ".js" )
            ), mediator );
        pNode = fixture.getJson( "NamingConventions/case21.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "FunctionNamingConventions" );
        msg.should.be.ok;
        msg.range.should.eql( [ 9, 16 ] );
        msg.loc.should.eql( new locEntity.Context( 1, 9, 1, 16 ) );
      });

      it("must trigger violation when pascalcase expected, but camel case found (function inValid() {})", function () {
        var rule =  {
              "allowCase": ["pascal"],
              "allowRepeating": true,
              "allowNumbers": true
            }, caseId = "case22";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NamingConventions/" + caseId + ".js" )
            ), mediator );

        pNode = fixture.getJson( "NamingConventions/case22.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "FunctionNamingConventions" ).should.be.ok;
      });

      it("must not trigger violation when numbers allowed expected and found (function inValid123() {})", function () {
        var rule =  {
              "allowCase": ["camel"],
              "allowRepeating": true,
              "allowNumbers": true
            }, caseId = "case23";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NamingConventions/" + caseId + ".js" )
            ), mediator );

        pNode = fixture.getJson( "NamingConventions/case23.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessages().should.not.be.ok;
      });


      it("must trigger violation when numbers not allowed expected,but found (function inValid123() {})", function () {
        var rule =  {
              "allowCase": ["camel"],
              "allowRepeating": true,
              "allowNumbers": false
            }, caseId = "case23";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NamingConventions/" + caseId + ".js" )
            ), mediator );
        pNode = fixture.getJson( "NamingConventions/case23.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "FunctionNamingNumbersNotAllowed" ).should.be.ok;
      });

      it("must trigger violation when pascalcase or camelcase expected, but a string to none compliant found (function in_valid() {})",
        function () {
        var rule =  {
              "allowCase": ["camel", "pascal"],
              "allowRepeating": true,
              "allowNumbers": true
            }, caseId = "case24";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NamingConventions/" + caseId + ".js" )
            ), mediator );
        pNode = fixture.getJson( "NamingConventions/case24.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "FunctionNamingConventions" ).should.be.ok;
      });

      it("must trigger violation when no repeating uppercase expected, but some found found (function inVAlid() {})",
        function () {
        var rule =  {
              "allowCase": ["camel", "pascal"],
              "allowRepeating": false,
              "allowNumbers": true
            }, caseId = "case25";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NamingConventions/" + caseId + ".js" )
            ), mediator );
        pNode = fixture.getJson( "NamingConventions/case25.json" ).body[ 0 ];
        sniff.run( rule, pNode );
        mediator.getMessage( "FunctionNamingRepeatingUppercase" ).should.be.ok;
      });

      it("must trigger violation when camelcase expected, but pascal case found (var b, in_valid = function() {})", function () {
        var rule =  {
              "allowCase": ["camel"],
              "allowRepeating": true,
              "allowNumbers": true
            }, msg, caseId = "case13";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NamingConventions/" + caseId + ".js" )
            ), mediator );

        pNode = fixture.getJson( "NamingConventions/case13.json" ).body[ 0 ].declarations[ 1 ];
        sniff.run( rule, pNode );
        msg = mediator.getMessage( "FunctionNamingConventions" );
        msg.should.be.ok;
    });

      it("must trigger violation when camelcase expected, but pascal case found (function in_valid() {})", function () {
      var rule =  {
            "allowCase": ["camel"],
            "allowRepeating": true,
            "allowNumbers": true
          }, msg, caseId = "case12";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NamingConventions/" + caseId + ".js" )
            ), mediator );

      pNode = fixture.getJson( "NamingConventions/case12.json" ).body[ 0 ];
      sniff.run( rule, pNode );
      msg = mediator.getMessage( "FunctionNamingConventions" );
      msg.should.be.ok;
    });

    it("must trigger violation when camelcase expected, but pascal case found (var b, in_valid = function() {})", function () {
      var rule =  {
            "allowCase": ["camel"],
            "allowRepeating": true,
            "allowNumbers": true
          }, msg, caseId = "case13";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NamingConventions/" + caseId + ".js" )
            ), mediator );

      pNode = fixture.getJson( "NamingConventions/case13.json" ).body[ 0 ].declarations[ 1 ];
      sniff.run( rule, pNode );
      msg = mediator.getMessage( "FunctionNamingConventions" );
      msg.should.be.ok;
    });

    it("must not trigger violation (var inVAlid = 1)", function () {
      var rule =  {
            "allowCase": ["camel"],
            "allowRepeating": false,
            "allowNumbers": true
          }, caseId = "case6";
				sniff = new sniffClass( new SourceCodeStub( fixture.getText( "NamingConventions/" + caseId + ".js" )
            ), mediator );

      pNode = fixture.getJson( "NamingConventions/case6.json" ).body[ 0 ].declarations[ 0 ];
      sniff.run( rule, pNode );
      mediator.getMessages().should.not.be.ok;
    });
  });


});

