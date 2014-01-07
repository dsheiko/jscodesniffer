/*jshint -W068 */
/*jshint multistr: true */
var Sniffer = require("../lib/Sniffer");

require("should");

Array.prototype.hasErrorCode = function( errCode ) {
  return !!this.filter(function( msg ){
    return msg.errorCode === errCode;
  }).length;
};

describe( "jQuery standard", function () {


    describe( " ( Compaund statement spacing ) ", function () {
      var options = {},
          sniffer,
          logger = null;

      beforeEach(function(){
        options = {
            highlight: "1",
            report: "summary",
            standard: "Jquery",
            reportWidth: 84
        };
        sniffer = new Sniffer();
      });

      afterEach(function(){
        logger.reset();
      });


      it("if(condition) doSomething();  must trigger errors", function () {
        logger = sniffer.getTestResults( "if(condition) doSomething();", options );
        logger.getMessages().hasErrorCode("CompoundStatementRequireBraces").should.be.ok;
        logger.getMessages().hasErrorCode("CompoundStatementRequireMultipleLines").should.be.ok;
      });

      it("while(!condition) iterating++;  must trigger errors", function () {
        logger = sniffer.getTestResults( "while(!condition) iterating++;", options );
        logger.getMessages().hasErrorCode("CompoundStatementRequireBraces").should.be.ok;
        logger.getMessages().hasErrorCode("CompoundStatementRequireMultipleLines").should.be.ok;
      });

      it("for(var i=0;i<100;i++) object[array[i]] = someFn(i);  must trigger errors", function () {
        logger = sniffer.getTestResults( "for(var i=0;i<100;i++) object[array[i]] = someFn(i);", options );
        logger.getMessages().hasErrorCode("CompoundStatementRequireBraces").should.be.ok;
        logger.getMessages().hasErrorCode("CompoundStatementRequireMultipleLines").should.be.ok;
      });

      it("'if' multiline with parens must pass", function () {
        var code = "if ( condition ) {\n\
doSomething();\n\
} else if ( otherCondition ) {\n\
somethingElse();\n\
} else {\n\
otherThing();\n\
}";
      logger = sniffer.getTestResults( code, options );
      logger.getMessages().length.should.not.be.ok;
      });

      it("'while' multiline with parens must pass", function () {
        var code = "while ( !condition ) {\n\
iterating++;\n\
}";
      logger = sniffer.getTestResults( code, options );
      logger.getMessages().length.should.not.be.ok;
      });

      it("'for' multiline with parens must pass", function () {
        var code = "for ( ; i < 100; i++ ) {\n\
object[ array[ i ] ] = someFn( i );\n\
}";
      logger = sniffer.getTestResults( code, options );
      logger.getMessages().length.should.not.be.ok;
      });

      it("'try' multiline with parens must pass", function () {
        var code = "try {\n\
// Expressions\n\
} catch ( e ) {\n\
// Expressions\n\
}";
      logger = sniffer.getTestResults( code, options );
      logger.getMessages().length.should.not.be.ok;
      });

    });

    describe( " ( Spacing in general ) ", function () {
      var options = {},
          sniffer,
          logger = null;

      beforeEach(function(){
        options = {
            highlight: "1",
            report: "summary",
            standard: "Jquery",
            reportWidth: 84
        };
        sniffer = new Sniffer();
        });

        afterEach(function(){
          logger.reset();
        });


      it("var i = 0 must pass", function () {
        logger = sniffer.getTestResults( "var i = 0;", options );
        logger.getMessages().length.should.not.be.ok;
      });

      it("indentation with spaces must trigger error", function () {
        logger = sniffer.getTestResults( "  var i = 0;", options );
        logger.getMessages().hasErrorCode( "OnlyTabsAllowedForIndentation" ).should.be.ok;
      });

      it("indentation with tabs must pass", function () {
        logger = sniffer.getTestResults( "\t\tvar i = 0;", options );
        logger.getMessages().length.should.not.be.ok;
      });

      it("trailing space must trigger error", function () {
        logger = sniffer.getTestResults( "var i = 0;  \n", options );
        logger.getMessages().hasErrorCode( "LineTrailingSpacesNotAllowed" ).should.be.ok;
      });

      it("Unary special-character operators must not have space next to their operand", function () {
        logger = sniffer.getTestResults( "\t\tvar i = 0;", options );
        logger.getMessages().length.should.not.be.ok;
      });

      it("Any , and ; must not have preceding space (1)", function () {
        logger = sniffer.getTestResults( "var foo , bar;", options );
        logger.getMessages().hasErrorCode( "CommaPrecedingSpacesNotAllowed" ).should.be.ok;
      });
      it("Any , and ; must not have preceding space (2)", function () {
        logger = sniffer.getTestResults( "var foo, bar ;", options );
        logger.getMessages().hasErrorCode( "SemicolonPrecedingSpacesNotAllowed" ).should.be.ok;
      });
      it("Any , and ; must not have preceding space (3)", function () {
        logger = sniffer.getTestResults( "var obj = { foo: 1 , bar: 2 };", options );
        logger.getMessages().hasErrorCode( "CommaPrecedingSpacesNotAllowed" ).should.be.ok;
      });
      it("Any , and ; must not have preceding space (4)", function () {
        logger = sniffer.getTestResults( "var arr = [ 1 , 2 ];", options );
        logger.getMessages().hasErrorCode( "CommaPrecedingSpacesNotAllowed" ).should.be.ok;
      });

      it("The ? and : in a ternary conditional must have space on both sides (1)", function () {
        logger = sniffer.getTestResults( "var a = true? true : false;", options );
        logger.getMessages().hasErrorCode( "TernaryConditionalTestTrailingWhitespaces" ).should.be.ok;
      });
      it("The ? and : in a ternary conditional must have space on both sides (2)", function () {
        logger = sniffer.getTestResults( "var a = true ?true : false;", options );
        logger.getMessages().hasErrorCode( "TernaryConditionalConsequentPrecedingWhitespaces" ).should.be.ok;
      });
      it("The ? and : in a ternary conditional must have space on both sides (3)", function () {
        logger = sniffer.getTestResults( "var a = true ? true: false;", options );
        logger.getMessages().hasErrorCode( "TernaryConditionalConsequentTrailingWhitespaces" ).should.be.ok;
      });
      it("The ? and : in a ternary conditional must have space on both sides (4)", function () {
        logger = sniffer.getTestResults( "var a = true ? true :false;", options );
        logger.getMessages().hasErrorCode( "TernaryConditionalAlternatePrecedingWhitespaces" ).should.be.ok;
      });
      it("The ? and : in a ternary conditional must have space on both sides (5)", function () {
        logger = sniffer.getTestResults( "var a = true ? true : false;", options );
        logger.getMessages().length.should.not.be.ok;
      });

      it("No filler spaces in empty constructs (e.g., {}, [], fn()) (1)", function () {
        logger = sniffer.getTestResults( "var obj = { };", options );
        logger.getMessages().hasErrorCode( "EmptyConstructsSpacing" ).should.be.ok;
      });
      it("No filler spaces in empty constructs (e.g., {}, [], fn()) (2)", function () {
        logger = sniffer.getTestResults( "var arr = [ ];", options );
        logger.getMessages().hasErrorCode( "EmptyConstructsSpacing" ).should.be.ok;
      });
      it("No filler spaces in empty constructs (e.g., {}, [], fn()) (3)", function () {
        logger = sniffer.getTestResults( "function fn( ){};", options );
        logger.getMessages().hasErrorCode( "EmptyConstructsSpacing" ).should.be.ok;
      });
      it("No filler spaces in empty constructs (e.g., {}, [], fn()) (4)", function () {
        logger = sniffer.getTestResults( "var fn = function( ){};", options );
        logger.getMessages().hasErrorCode( "EmptyConstructsSpacing" ).should.be.ok;
      });
      it("No filler spaces in empty constructs (e.g., {}, [], fn()) (5)", function () {
        logger = sniffer.getTestResults( "fn( );", options );
        logger.getMessages().hasErrorCode( "EmptyConstructsSpacing" ).should.be.ok;
      });
      it("No filler spaces in empty constructs (e.g., {}, [], fn()) (6)", function () {
        logger = sniffer.getTestResults( "var fn = function(){};", options );
        logger.getMessages().length.should.not.be.ok;
      });
      it("No filler spaces in empty constructs (e.g., {}, [], fn()) (6)", function () {
        logger = sniffer.getTestResults( "function fn(){};", options );
        logger.getMessages().length.should.not.be.ok;
      });
      it("No filler spaces in empty constructs (e.g., {}, [], fn()) (7)", function () {
        logger = sniffer.getTestResults( "foo(/*xxx*/);", options );
        logger.getMessages().length.should.not.be.ok;
      });

    });

  describe( " ( Exceptions ) ", function () {
      var options = {},
          sniffer,
          logger = null;

      beforeEach(function(){
        options = {
            highlight: "1",
            report: "summary",
            standard: "Jquery",
            reportWidth: 84
        };
        sniffer = new Sniffer();
        });

        afterEach(function(){
          logger.reset();
        });

        it("Function with a callback, object, or array as the sole argument", function () {
          logger = sniffer.getTestResults( "foo({\na: \"alpha\",\nb: \"beta\"\n});", options );
          logger.getMessages().length.should.not.be.ok;
        });

        it("Function with a callback, object, or array as the first argument:", function () {
          logger = sniffer.getTestResults( "foo(function(){}, options );", options );
          logger.getMessages().length.should.not.be.ok;
        });

        it("Function with a callback, object, or array as the first argument:", function () {
          logger = sniffer.getTestResults( "foo( data, function() {\n// Do stuff\n});", options );
          logger.getMessages().length.should.not.be.ok;
        });

      });

    describe( " ( Chained Method Calls ) ", function () {
      var options = {},
          sniffer,
          logger = null;

      beforeEach(function(){
        options = {
            highlight: "1",
            report: "summary",
            standard: "Jquery",
            reportWidth: 84
        };
        sniffer = new Sniffer();
        });

        afterEach(function(){
          logger.reset();
        });

        it("there must be one call per line, with the first call on a separate line from the object the methods are called on (1)", function () {
          logger = sniffer.getTestResults( "elements\n.addClass( \"foo\" )\n.children();", options );
          logger.getMessages().length.should.not.be.ok;
        });

        it("there must be one call per line, with the first call on a separate line from the object the methods are called on (2)", function () {
          logger = sniffer.getTestResults( "elements\n.addClass( \"foo\" ).children();", options );
          logger.getMessages().hasErrorCode( "ChainedMethodCallsOnePerLine" ).should.be.ok;
        });

    });

    describe( " ( Assignments ) ", function () {
      var options = {},
          sniffer,
          logger = null;

      beforeEach(function(){
        options = {
            highlight: "1",
            report: "summary",
            standard: "Jquery",
            reportWidth: 84
        };
        sniffer = new Sniffer();
        });

        afterEach(function(){
          logger.reset();
        });

        it("Assignments in a declaration must be on their own line. Declarations that don't have an assignment must be listed together at the start of the declaration.", function () {
          logger = sniffer.getTestResults( "(function(){var foo = true; var bar = false;})", options );
          logger.getMessages().hasErrorCode( "MultipleVarDeclarationPerBlockScope" ).should.be.ok;
        });
    });

    describe( " ( Quotes ) ", function () {
      var options = {},
          sniffer,
          logger = null;

      beforeEach(function(){
        options = {
            highlight: "1",
            report: "summary",
            standard: "Jquery",
            reportWidth: 84
        };
        sniffer = new Sniffer();
        });

        afterEach(function(){
          logger.reset();
        });

        it("jQuery uses double quotes.", function () {
          logger = sniffer.getTestResults( "var a = 'text';", options );
          logger.getMessages().hasErrorCode( "QuoteConventionsSingleQuotesNotAllowed" ).should.be.ok;
        });
    });

    describe( " ( Naming Conventions ) ", function () {
      var options = {},
          sniffer,
          logger = null;

      beforeEach(function(){
        options = {
            highlight: "1",
            report: "summary",
            standard: "Jquery",
            reportWidth: 84
        };
        sniffer = new Sniffer();
        });

        afterEach(function(){
          logger.reset();
        });

        it("Variables must go caMel style.", function () {
          logger = sniffer.getTestResults( "var not_camel_style;", options );
          logger.getMessages().hasErrorCode( "VariableNamingConventions" ).should.be.ok;
        });
        it("Variables must go caMel style.", function () {
          logger = sniffer.getTestResults( "var PascalStyle;", options );
          logger.getMessages().hasErrorCode( "VariableNamingConventions" ).should.be.ok;
        });
        it("Constructors must go PasCal style.", function () {
          logger = sniffer.getTestResults( "var PascalStyle = function(){};", options );
          logger.getMessages().length.should.not.be.ok;
        });
    });

    describe( " ( Spacing object literals ) ", function () {
      var options = {},
          sniffer,
          logger = null;

      beforeEach(function(){
        options = {
            highlight: "1",
            report: "summary",
            standard: "Jquery",
            reportWidth: 84
        };
        sniffer = new Sniffer();
        });

        afterEach(function(){
          logger.reset();
        });

        it("Object literal must have 1 space preceding key", function () {
          logger = sniffer.getTestResults( "var obj = {prop: 1 }", options );
          logger.getMessages().hasErrorCode( "ObjectPropertyKeyPrecedingSpacing" ).should.be.ok;
        });
        it("Object literal must have 1 space preceding value", function () {
          logger = sniffer.getTestResults( "var obj = { prop:1 }", options );
          logger.getMessages().hasErrorCode( "ObjectPropertyValuePrecedingSpacing" ).should.be.ok;
        });
        it("Any : after a property name in an object definition must not have preceding space.", function () {
          logger = sniffer.getTestResults( "var obj = { prop : 1 }", options );
          logger.getMessages().hasErrorCode( "ObjectPropertyKeyTrailingSpacing" ).should.be.ok;
        });
        it("Object literal must have 1 space trailing value", function () {
          logger = sniffer.getTestResults( "var obj = { prop: 1}", options );
          logger.getMessages().hasErrorCode( "ObjectPropertyValueTrailingSpacing" ).should.be.ok;
        });

      });



    describe( " ( Spacing array literals ) ", function () {
      var options = {},
          sniffer,
          logger = null;

      beforeEach(function(){
        options = {
            highlight: "1",
            report: "summary",
            standard: "Jquery",
            reportWidth: 84
        };
        sniffer = new Sniffer();
        });

        afterEach(function(){
          logger.reset();
        });

        it("Array literal must have 1 space preceding element", function () {
          logger = sniffer.getTestResults( "var arr = [1, 1 ]", options );
          logger.getMessages().hasErrorCode( "ArraylElementPrecedingSpacing" ).should.be.ok;
        });

        it("Array literal must have 1 space trailing key", function () {
          logger = sniffer.getTestResults( "var arr = [ 1, 1]", options );
          //console.log(logger.getMessages());
          logger.getMessages().hasErrorCode( "ArraylElementTrailingSpacing" ).should.be.ok;
        });

      });


});
