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

describe( " Custom standard ", function () {
  var sniffer, logger = null;
  beforeEach(function(){
    sniffer = new Sniffer();
  });

  it(" must accept ParametersSpacing exceptions", function () {
		var code = "function foo( a,b ){}",
			modifiers = {
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
		logger.getMessages().length.should.not.be.ok;
  });

	it(" must accept ArrayLiteralSpacing exceptions", function () {
		var code = "var arr = [ 1,2,3 ]",
			modifiers = {
				"ArrayLiteralSpacing": {
					"allowElementPrecedingWhitespaces": 0,
					"allowElementTrailingWhitespaces": 0,
					"exceptions": {
						"singleElement": {
							"for": [ "Literal" ],
							"allowElementPrecedingWhitespaces": 0,
							"allowElementTrailingWhitespaces": 0
						},
						"firstElement": {
							"for": [ "Literal" ],
							"allowElementPrecedingWhitespaces": 1
						},
						"lastElement": {
							"for": [ "Literal" ],
							"allowElementTrailingWhitespaces": 1
						}
					}
				}
			};
    logger = sniffer.getTestResults( code, OPTIONS, modifiers );
		console.log(logger.getMessages());
		//logger.getMessages().length.should.not.be.ok;
  });
});