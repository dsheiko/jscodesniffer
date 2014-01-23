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
   var code = "function foo( a,b ){}",

	modifiers = {
		"Indentation": false,
		"QuoteConventions": false,

		"ParametersSpacing": {
			"allowParamPrecedingWhitespaces": 0,
			"allowParamTrailingWhitespaces": 0,
			"exceptions": {
				"singleParam": {
					"for": [ "Identifier" ],
					"allowParamPrecedingWhitespaces": 0,
					"allowParamTrailingWhitespaces": 0
				},
				"firstParam": {
					"for": [ "Identifier" ],
					"allowParamPrecedingWhitespaces": 1
				},
				"lastParam": {
					"for": [ "Identifier" ],
					"allowParamTrailingWhitespaces": 1
				}
			}
		}
	};
    logger = sniffer.getTestResults( code, OPTIONS, modifiers );
    console.log(logger.getMessages());
		//logger.getMessages().length.should.not.be.ok;
  });
});