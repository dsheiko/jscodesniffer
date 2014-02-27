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
   var code = "var w = 1,\n\
x = [1, 2, 3],\n\
y = [x[0], x[1], x[2]],\n\
z = [w + 1];",

    modifiers = {
     "ArrayLiteralSpacing": {
				"allowElementPrecedingWhitespaces": 1,
				"allowElementTrailingWhitespaces": 0,
				"exceptions": {
					"singleElement": {
						"for": [ "Identifier", "FunctionExpression", "Literal", "ObjectExpression", "ArrayExpression", "BinaryExpression" ],
						"allowElementPrecedingWhitespaces": 0,
						"allowElementTrailingWhitespaces": 0
					},
					"firstElement": {
						"for": [ "Identifier", "FunctionExpression", "Literal", "ObjectExpression", "ArrayExpression", "MemberExpression" ],
						"allowElementPrecedingWhitespaces": 0
					},
					"lastElement": {
						"for": [ "Identifier", "Literal", "MemberExpression" ],
						"allowElementTrailingWhitespaces": 0
					}
				}
			}

    };


    logger = sniffer.getTestResults( code, OPTIONS, modifiers );
    //console.log(logger.getMessages());
		logger.getMessages().length.should.not.be.ok;
  });
});