/*jshint -W068 */
/*jshint multistr: true */
var Sniffer = require( "../lib/Sniffer" );

require( "should" );

Array.prototype.hasErrorCode = function( errCode ) {
  return !!this.filter(function( msg ){
    return msg.errorCode === errCode;
  }).length;
};

var OPTIONS = {
      standard: "Jquery"
  };

describe( " Custom checks ", function () {
  var sniffer, logger = null;
  beforeEach(function(){
    sniffer = new Sniffer();
  });

  it(" must implement custom standard correctly", function () {
   var code = "arr = [ 1,1 ]",

	modifiers = {
		"Indentation": false,
		"QuoteConventions": false,
		"ParametersSpacing": {
			"allowParamPrecedingWhitespaces": 0,
			"allowParamTrailingWhitespaces": 0
		},

		"ArrayLiteralSpacing": {
			"allowElementPrecedingWhitespaces": 0,
			"allowElementTrailingWhitespaces": 0,
			"exceptions": {
				"singleArg": {
					"for": [ "Literal" ],
					"allowElementPrecedingWhitespaces": 0,
					"allowElementTrailingWhitespaces": 0
				},
				"firstArg": {
					"for": [ "Literal" ],
					"allowElementPrecedingWhitespaces": 1
				},
				"lastArg": {
					"for": [ "Literal" ],
					"allowElementTrailingWhitespaces": 1
				}
			}
		}
	};

    logger = sniffer.getTestResults( code, OPTIONS, modifiers );
    //console.log(logger.getMessages());
		logger.getMessages().length.should.not.be.ok;
  });

});


