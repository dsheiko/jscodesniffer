/*jshint -W068 */
var fixture = require( "./inc/fixture" ),
    locEntity = require( "./inc/LocEntity" ),
    sniffClass = require( "../lib/Sniff/SyntaxTree/VariableNamingConventions" ),
    mediatorMock = require( "./inc/MediatorMock" );

require( "should" );
describe( "VariableNamingConventions", function () {
  describe( "(contract)", function () {
    var sniff,
        mediator,
        msg = null;

      beforeEach(function(){
        mediator = new mediatorMock();
        sniff = new sniffClass( null, mediator );
        msg = null;
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
        mediator,
        msg = null;

      beforeEach(function(){
        mediator = new mediatorMock();
        sniff = new sniffClass( null, mediator );
        msg = null;

      });

      it("must trigger violation when camelcase expected, but pascal case found (var InValid = 1)", function () {
        var rule =  {
              "allowCase": ["camel"],
              "allowRepeating": true,
              "allowNumbers": true
            };

        pNode = fixture.getJson( "NamingConventions/case2.json" ).body[ 0 ].declarations[ 0 ];


        sniff.run( rule, pNode.id, pNode );
        msg = mediator.getMessage( "VariableNamingConventions" );

        msg.should.be.ok;
        msg.errorCode.should.eql( "VariableNamingConventions" );
        msg.range.should.eql( [ 4, 11 ] );
        msg.loc.should.eql( new locEntity.Context( 1, 4, 1, 11 ) );
      });

      it("must trigger violation when pascalcase expected, but camel case found (var inValid = 1)", function () {
        var rule =  {
              "allowCase": ["pascal"],
              "allowRepeating": true,
              "allowNumbers": true
            };

        pNode = fixture.getJson( "NamingConventions/case1.json" ).body[ 0 ].declarations[ 0 ];
        sniff.run( rule, pNode.id, pNode );
        mediator.getMessage( "VariableNamingConventions" ).should.be.ok;
      });

      it("must trigger violation when pascalcase or camelcase expected, but a string to none compliant found (var in_valid = 1)",
        function () {
        var rule =  {
              "allowCase": ["camel", "pascal"],
              "allowRepeating": true,
              "allowNumbers": true
            };
        pNode = fixture.getJson( "NamingConventions/case3.json" ).body[ 0 ].declarations[ 0 ];
        sniff.run( rule, pNode.id, pNode );
        mediator.getMessage( "VariableNamingConventions" ).should.be.ok;
      });

      it("must not trigger violation when camelcase expected and found (var validOne = 1)",
        function () {
        var rule =  {
              "allowCase": ["camel"],
              "allowRepeating": true,
              "allowNumbers": true
            };
        pNode = fixture.getJson( "NamingConventions/case4.json" ).body[ 0 ].declarations[ 0 ];
        sniff.run( rule, pNode.id, pNode );
        mediator.getMessage( "VariableNamingConventions" ).should.not.be.ok;
      });




      it("must not trigger violation when camelcase expected and name prefixed with $ found (var $validOne = 1)",
        function () {
        var rule =  {
              "allowCase": ["camel"],
              "allowRepeating": true,
              "allowNumbers": true
            };
        pNode = fixture.getJson( "NamingConventions/case8.json" ).body[ 0 ].declarations[ 0 ];
        sniff.run( rule, pNode.id, pNode );
        mediator.getMessage( "VariableNamingConventions" ).should.not.be.ok;
      });

      it("must not trigger violation when camelcase expected and name prefixed with _ found (var _validOne = 1)",
        function () {
        var rule =  {
              "allowCase": ["camel"],
              "allowRepeating": true,
              "allowNumbers": true
            };
        pNode = fixture.getJson( "NamingConventions/case5.json" ).body[ 0 ].declarations[ 0 ];
        sniff.run( rule, pNode.id, pNode );
        mediator.getMessage( "VariableNamingConventions" ).should.not.be.ok;
      });



      it("must trigger violation when no repeating uppercase expected, but some found found (var inVAlid = 1)",
        function () {
        var rule =  {
              "allowCase": ["camel", "pascal"],
              "allowRepeating": false,
              "allowNumbers": true
            };
        pNode = fixture.getJson( "NamingConventions/case6.json" ).body[ 0 ].declarations[ 0 ];
        sniff.run( rule, pNode.id, pNode );
        mediator.getMessage( "VariableNamingRepeatingUppercase" ).should.be.ok;
      });


        it("must not trigger violation when numbers allowed expected and found (var inValid123 = 1)", function () {
        var rule =  {
              "allowCase": ["camel"],
              "allowRepeating": true,
              "allowNumbers": true
            };

        pNode = fixture.getJson( "NamingConventions/case7.json" ).body[ 0 ].declarations[ 0 ];
        sniff.run( rule, pNode.id, pNode );
        mediator.getMessage( "VariableNamingRepeatingUppercase" ).should.not.be.ok;
      });


      it("must trigger violation when numbers not allowed expected, but found (var inValid123 = 1)", function () {
        var rule =  {
              "allowCase": ["camel"],
              "allowRepeating": true,
              "allowNumbers": false
            };

        pNode = fixture.getJson( "NamingConventions/case7.json" ).body[ 0 ].declarations[ 0 ];
        sniff.run( rule, pNode.id, pNode );
        mediator.getMessage( "VariableNamingNumbersNotAllowed" ).should.be.ok;
      });


      it("must trigger violation when camelcase expected, but pascal case found (in_valid = 1)", function () {
      var rule =  {
            "allowCase": ["camel"],
            "allowRepeating": true,
            "allowNumbers": true
          };

      pNode = fixture.getJson( "NamingConventions/case10.json" ).body[ 0 ].expression;
      sniff.run( rule, pNode.left, pNode );
      mediator.getMessages( "VariableNamingConventions" ).should.be.ok;
    });

    it("must trigger violation when camelcase expected, but pascal case found (foo(in_valid);)", function () {
      var rule =  {
            "allowCase": ["camel"],
            "allowRepeating": true,
            "allowNumbers": true
          };

      pNode = fixture.getJson( "NamingConventions/case11.json" ).body[ 0 ].expression;
      sniff.run( rule, pNode[ "arguments" ][ 0 ], pNode );
      mediator.getMessage( "VariableNamingConventions" ).should.be.ok;
    });

    it("must not trigger violation on (function in_valid() {})", function () {
      var rule =  {
            "allowCase": ["camel"],
            "allowRepeating": true,
            "allowNumbers": true
          };

      pNode = fixture.getJson( "NamingConventions/case12.json" ).body[ 0 ];
      sniff.run( rule, pNode.id, pNode );
      mediator.getMessages().should.not.be.ok;
    });

    it("must not trigger violation on (var b, in_valid = function() {})", function () {
      var rule =  {
            "allowCase": ["camel"],
            "allowRepeating": true,
            "allowNumbers": true
          };
      pNode = fixture.getJson( "NamingConventions/case13.json" ).body[ 0 ].declarations[ 1 ];
      sniff.run( rule, pNode.id, pNode );
      mediator.getMessages().should.not.be.ok;
    });

    it("must not trigger violation (in_valid = function() {})", function () {
      var rule =  {
            "allowCase": ["camel"],
            "allowRepeating": true,
            "allowNumbers": true
          };
      pNode = fixture.getJson( "NamingConventions/case14.json" ).body[ 0 ].expression;
      sniff.run( rule, pNode.left, pNode );
      mediator.getMessages().should.not.be.ok;
    });

    it("must not trigger violation on (window.XMLHttpRequest())", function () {
      var rule =  {
            "allowCase": ["camel"],
            "allowRepeating": true,
            "allowNumbers": true
          };

      pNode = fixture.getJson( "NamingConventions/case15.json" ).body[ 0 ].expression.callee;
      sniff.run( rule, pNode.property, pNode );
      mediator.getMessages().should.not.be.ok;
    });


  });
});
