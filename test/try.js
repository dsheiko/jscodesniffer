/*jshint -W068 */
/*jshint multistr: true */
var Sniffer = require( "../lib/Sniffer" );

require( "should" );

Array.prototype.hasErrorCode = function( errCode ) {
  return !!this.filter(function( msg ){
    return msg.errorCode === errCode;
  }).length;
};

var OPTIONS = { standard: "Jquery"  };

describe( " Custom checks ", function () {
  var sniffer, logger = null;
  beforeEach(function(){
    sniffer = new Sniffer();
  });

  it(" must implement custom standard correctly", function () {
   var code = "if (dumb)\n{\ndumb = 1;\n}a = 1;\n",

    modifiers = {
      "CompoundStatementConventions": {
        "for": [
          "IfStatement",
          "SwitchStatement",
          "WhileStatement",
          "DoWhileStatement",
          "ForStatement",
          "ForInStatement",
          "WithStatement",
          "TryStatement"
        ],
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
    console.log(logger.getMessages());
		//logger.getMessages().length.should.not.be.ok;
  });
});