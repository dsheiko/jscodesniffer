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

describe( "CompoundStatementConventions", function () {
  var sniffer, logger = null;
  beforeEach(function(){
    sniffer = new Sniffer();
  });

  describe( "IfStatement", function () {
    it(" treats  allow(*)Brace(*)Whitespaces, require(*)BracePrecedingNewLine correctly (1)", function () {
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
    it(" throws errors when no whitespace preceding opening brace, but one required, NL required (2)", function () {
     var code = "if (dumb){\ndumb = 1;\n}",
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
      //console.log(logger.getMessages());
      logger.getMessages().hasErrorCode( "CompoundStatementAllowOpeningBracePrecedingWhitespaces" ).
        should.be.ok;
      logger.getMessages().hasErrorCode( "CompoundStatementRequireOpeningBracePrecedingNewLine" ).
        should.be.ok;
      //logger.getMessages().length.should.not.be.ok;
  });
  it(" throws errors when no LN preceding opening brace, but one required (3)", function () {
     var code = "if (dumb) {\ndumb = 1;\n}",
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
      //console.log(logger.getMessages());

      logger.getMessages().hasErrorCode( "CompoundStatementRequireOpeningBracePrecedingNewLine" ).
        should.be.ok;
      //logger.getMessages().length.should.not.be.ok;
    });
  });
});