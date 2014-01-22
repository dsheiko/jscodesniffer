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
   var code = "var core = require('core');",

	modifiers = {
		"Indentation": false,
		"QuoteConventions": {
			"allowDoubleQuotes": false,
			"allowSingleQuotes": true
		},
		"ParametersSpacing": {
			"allowParamPrecedingWhitespaces": 0,
			"allowParamTrailingWhitespaces": 0
		},
		"ArgumentsSpacing": {
				"allowArgPrecedingWhitespaces": 1,
				"allowArgTrailingWhitespaces": 0,
				"exceptions": {
					"singleArg" : {
						"for": ["FunctionExpression", "ArrayExpression", "ObjectExpression", "Literal"],
						"allowArgPrecedingWhitespaces": 0,
						"allowArgTrailingWhitespaces": 0
					},
					"firstArg": {
						"for": [ "FunctionExpression" ],
						"allowArgPrecedingWhitespaces": 0
					},
					"lastArg": {
						"for": [ "FunctionExpression" ],
						"allowArgTrailingWhitespaces": 0
					}
				}
		}
	};

    logger = sniffer.getTestResults( code, OPTIONS, modifiers );
    //console.log(logger.getMessages());
		logger.getMessages().length.should.not.be.ok;
  });

});


