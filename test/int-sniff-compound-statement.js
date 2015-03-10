/*jshint -W068 */
/*jshint multistr: true */
var Sniffer = require( "../lib/Sniffer" );

require( "should" );

Array.prototype.hasErrorCode = function( errCode ) {
  return !!this.filter(function( msg ){
    return msg.errorCode === errCode;
  }).length;
};

var OPTIONS = { standard: "Jquery"  },
    counter = 0,
    inc = function() {
      return " (" + ( ++counter ) + ")";
    },
    statements = [
          "IfStatement",
          "SwitchStatement",
          "WhileStatement",
          "DoWhileStatement",
          "ForStatement",
          "ForInStatement",
          "WithStatement",
          "TryStatement"
        ];

describe( "CompoundStatementConventions /allow(*)Brace(*)Whitespaces, require(*)BracePrecedingNewLine/", function () {
  var sniffer, logger = null;
  beforeEach(function(){
    sniffer = new Sniffer();
  });

  describe( "IfStatement", function () {
    it(" throws no exceptions when code is valid" + inc(), function () {
     var code = "if (dumb)\n{\ndumb = 1;\n}",
      modifiers = {
        "CompoundStatementConventions": {
          "for": statements,
          "requireBraces": true,
          "requireMultipleLines": true,
          "allowOpeningBracePrecedingWhitespaces": 1,
          "allowOpeningBraceTrailingWhitespaces": 1,
          "requireOpeningBracePrecedingNewLine": true,
          "requireOpeningBraceTrailingNewLine": true,
          "allowClosingBracePrecedingWhitespaces": 1,
          "requireClosingBracePrecedingNewLine": true
        }
      };
      logger = sniffer.getTestResults( code, OPTIONS, modifiers );
      logger.getMessages().length.should.not.be.ok;
    });
    it(" throws errors when no whitespace preceding opening brace, but one required, NL required" + inc(),
    function () {
     var code = "if (dumb){\ndumb = 1;\n}",
      modifiers = {
        "CompoundStatementConventions": {
          "for": statements,
          "allowOpeningBracePrecedingWhitespaces": 1,
          "requireOpeningBracePrecedingNewLine": true
        }
      };
      logger = sniffer.getTestResults( code, OPTIONS, modifiers );
      logger.getMessages().hasErrorCode( "CompoundStatementAllowOpeningBracePrecedingWhitespaces" ).
        should.be.ok;
      logger.getMessages().hasErrorCode( "CompoundStatementRequireOpeningBracePrecedingNewLine" ).
        should.be.ok;

    });
    it(" throws errors when no LN preceding opening brace, but one required" + inc(), function () {
       var code = "if (dumb) {\ndumb = 1;\n}",
        modifiers = {
          "CompoundStatementConventions": {
            "for": statements,
            "allowOpeningBracePrecedingWhitespaces": 1,
            "requireOpeningBracePrecedingNewLine": true
          }
        };
        logger = sniffer.getTestResults( code, OPTIONS, modifiers );
        logger.getMessages().hasErrorCode( "CompoundStatementRequireOpeningBracePrecedingNewLine" ).
          should.be.ok;
    });

    it(" throws no errors when no LN preceding opening brace and none required" + inc(), function () {
       var code = "if (dumb) {\ndumb = 1;\n}",
        modifiers = {
          "CompoundStatementConventions": {
            "for": statements,
            "allowOpeningBracePrecedingWhitespaces": 1, // OK
            "requireOpeningBracePrecedingNewLine": false
          }
        };
        logger = sniffer.getTestResults( code, OPTIONS, modifiers );
        logger.getMessages().length.should.not.be.ok;
    });


    it(" throws errors when no LN trailing opening brace, but one required" + inc(), function () {
       var code = "if (dumb)\n{ dumb = 1;\n}",
        modifiers = {
          "CompoundStatementConventions": {
            "for": statements,
            "allowOpeningBraceTrailingWhitespaces": 1,
            "requireOpeningBraceTrailingNewLine": true
          }
        };
        logger = sniffer.getTestResults( code, OPTIONS, modifiers );
        logger.getMessages().hasErrorCode( "CompoundStatementRequireOpeningBraceTrailingNewLine" ).
          should.be.ok;
    });

    it(" throws errors when many spaces trailing opening brace, but one required" + inc(), function () {
       var code = "if (dumb)\n{   dumb = 1;\n}",
        modifiers = {
          "CompoundStatementConventions": {
            "for": statements,
            "allowOpeningBraceTrailingWhitespaces": 1
          }
        };
        logger = sniffer.getTestResults( code, OPTIONS, modifiers );
        logger.getMessages().hasErrorCode( "CompoundStatementAllowOpeningBraceTrailingWhitespaces" ).
          should.be.ok;
    });

    it(" throws errors when no LN preceding closing brace, but one required" + inc(), function () {
       var code = "if (dumb)\n{ dumb = 1; }",
        modifiers = {
          "CompoundStatementConventions": {
            "for": statements,
            "allowClosingBracePrecedingWhitespaces": 1,
            "requireClosingBracePrecedingNewLine": true
          }
        };
        logger = sniffer.getTestResults( code, OPTIONS, modifiers );
        logger.getMessages().hasErrorCode( "CompoundStatementRequireClosingBracePrecedingNewLine" ).
          should.be.ok;
    });

    it(" throws errors when many spaces preceding closing brace, but one required" + inc(), function () {
       var code = "if (dumb)\n{ dumb = 1;   }",
        modifiers = {
          "CompoundStatementConventions": {
            "for": statements,
            "allowClosingBracePrecedingWhitespaces": 1
          }
        };
        logger = sniffer.getTestResults( code, OPTIONS, modifiers );
        logger.getMessages().hasErrorCode( "CompoundStatementAllowClosingBracePrecedingWhitespaces" ).
          should.be.ok;
    });
  });




  describe( "ForStatement", function () {
    it(" throws no exceptions when code is valid" + inc(), function () {
     var code = "for ( i = 1; i < 10; i++ )\n{\na = 2;\n}",
      modifiers = {
        "CompoundStatementConventions": {
          "for": statements,
          "requireBraces": true,
          "requireMultipleLines": true,
          "allowOpeningBracePrecedingWhitespaces": 1,
          "allowOpeningBraceTrailingWhitespaces": 1,
          "requireOpeningBracePrecedingNewLine": true,
          "requireOpeningBraceTrailingNewLine": true,
          "allowClosingBracePrecedingWhitespaces": 1,
          "requireClosingBracePrecedingNewLine": true
        }
      };
      logger = sniffer.getTestResults( code, OPTIONS, modifiers );
      logger.getMessages().length.should.not.be.ok;
    });

    it(" throws errors when no whitespace preceding opening brace, but one required, NL required" + inc(),
    function () {
     var code = "for ( i = 1; i < 10; i++ ){\na = 2;\n}",
      modifiers = {
        "CompoundStatementConventions": {
          "for": statements,
          "allowOpeningBracePrecedingWhitespaces": 1,
          "requireOpeningBracePrecedingNewLine": true
        }
      };
      logger = sniffer.getTestResults( code, OPTIONS, modifiers );
      logger.getMessages().hasErrorCode( "CompoundStatementAllowOpeningBracePrecedingWhitespaces" ).
        should.be.ok;
      logger.getMessages().hasErrorCode( "CompoundStatementRequireOpeningBracePrecedingNewLine" ).
        should.be.ok;
    });

    it(" throws errors when no whitespace trailing opening brace, but one required, NL required" + inc(),
    function () {
     var code = "for ( i = 1; i < 10; i++ )\n{a = 2;\n}",
      modifiers = {
        "CompoundStatementConventions": {
          "for": statements,
          "allowOpeningBraceTrailingWhitespaces": 1,
          "requireOpeningBraceTrailingNewLine": true
        }
      };
      logger = sniffer.getTestResults( code, OPTIONS, modifiers );
      logger.getMessages().hasErrorCode( "CompoundStatementAllowOpeningBraceTrailingWhitespaces" ).
        should.be.ok;
      logger.getMessages().hasErrorCode( "CompoundStatementRequireOpeningBraceTrailingNewLine" ).
        should.be.ok;
    });

    it(" throws errors when no whitespace preceding closing brace, but one required, NL required" + inc(),
    function () {
     var code = "for ( i = 1; i < 10; i++ )\n{\na = 2;}",
      modifiers = {
        "CompoundStatementConventions": {
          "for": statements,
          "allowClosingBracePrecedingWhitespaces": 1,
          "requireClosingBracePrecedingNewLine": true
        }
      };
      logger = sniffer.getTestResults( code, OPTIONS, modifiers );
      logger.getMessages().hasErrorCode( "CompoundStatementAllowClosingBracePrecedingWhitespaces" ).
        should.be.ok;
      logger.getMessages().hasErrorCode( "CompoundStatementRequireClosingBracePrecedingNewLine" ).
        should.be.ok;
    });

  });

  describe( "TryStatement", function () {
    it(" throws no exceptions when code is valid" + inc(), function () {
     var code = "try\n{\na = 1;\n} catch( err ){ a = 1}",
      modifiers = {
        "CompoundStatementConventions": {
          "for": statements,
          "requireBraces": true,
          "requireMultipleLines": true,
          "allowOpeningBracePrecedingWhitespaces": 1,
          "allowOpeningBraceTrailingWhitespaces": 1,
          "requireOpeningBracePrecedingNewLine": true,
          "requireOpeningBraceTrailingNewLine": true,
          "allowClosingBracePrecedingWhitespaces": 1,
          "requireClosingBracePrecedingNewLine": true
        }
      };
      logger = sniffer.getTestResults( code, OPTIONS, modifiers );
      logger.getMessages().length.should.not.be.ok;
    });

    it(" throws errors when no whitespace preceding opening brace, but one required, NL required" + inc(),
    function () {
     var code = "try{\na = 1;\n} catch( err ){ a = 1}",
      modifiers = {
        "CompoundStatementConventions": {
          "for": statements,
          "allowOpeningBracePrecedingWhitespaces": 1,
          "requireOpeningBracePrecedingNewLine": true
        }
      };
      logger = sniffer.getTestResults( code, OPTIONS, modifiers );
      logger.getMessages().hasErrorCode( "CompoundStatementAllowOpeningBracePrecedingWhitespaces" ).
        should.be.ok;
      logger.getMessages().hasErrorCode( "CompoundStatementRequireOpeningBracePrecedingNewLine" ).
        should.be.ok;
    });

    it(" throws errors when no whitespace trailing opening brace, but one required, NL required" + inc(),
    function () {
     var code = "try\n{a = 1;\n} catch( err ){ a = 1}",
      modifiers = {
        "CompoundStatementConventions": {
          "for": statements,
          "allowOpeningBraceTrailingWhitespaces": 1,
          "requireOpeningBraceTrailingNewLine": true
        }
      };
      logger = sniffer.getTestResults( code, OPTIONS, modifiers );
      logger.getMessages().hasErrorCode( "CompoundStatementAllowOpeningBraceTrailingWhitespaces" ).
        should.be.ok;
      logger.getMessages().hasErrorCode( "CompoundStatementRequireOpeningBraceTrailingNewLine" ).
        should.be.ok;
    });

    it(" throws errors when no whitespace preceding closing brace, but one required, NL required" + inc(),
    function () {
     var code = "try\n{\na = 1;} catch( err ){ a = 1}",
      modifiers = {
        "CompoundStatementConventions": {
          "for": statements,
          "allowClosingBracePrecedingWhitespaces": 1,
          "requireClosingBracePrecedingNewLine": true
        }
      };
      logger = sniffer.getTestResults( code, OPTIONS, modifiers );
      logger.getMessages().hasErrorCode( "CompoundStatementAllowClosingBracePrecedingWhitespaces" ).
        should.be.ok;
      logger.getMessages().hasErrorCode( "CompoundStatementRequireClosingBracePrecedingNewLine" ).
        should.be.ok;
    });

  });

});
