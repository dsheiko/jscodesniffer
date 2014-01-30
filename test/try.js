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
   var code = "ok.push([ok[1]]);",

    modifiers = {
      "LineLength": false,
      "Indentation": false,
      "QuoteConventions": false,
      "ArgumentsSpacing": false,
      "ParametersSpacing": false,
      "ObjectLiteralSpacing": false,
      "ArrayLiteralSpacing": {
            "allowElementPrecedingWhitespaces": 1,
            "allowElementTrailingWhitespaces": 0,
            "exceptions": {
                "singleElement": {
                    "for": [ "FunctionExpression", "ArrayExpression", "ObjectExpression", "Literal" ],
                    "allowElementPrecedingWhitespaces": 0,
                    "allowElementTrailingWhitespaces": 0
                },
                "firstElement": {
                    "for": [ "FunctionExpression", "ArrayExpression", "ObjectExpression", "Literal" ],
                    "allowElementPrecedingWhitespaces": 0
                },
                "lastElement": {
                    "for": [ "FunctionExpression", "ArrayExpression", "ObjectExpression", "Literal" ],
                    "allowElementTrailingWhitespaces": 0
                }
            }
        }
    };


    logger = sniffer.getTestResults( code, OPTIONS, modifiers );
    console.log(logger.getMessages());
		//logger.getMessages().length.should.not.be.ok;
  });
});