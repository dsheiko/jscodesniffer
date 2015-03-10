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
   var code = "$(selector).css(\"width\", final + \"px\");",

    modifiers = {
     "ArgumentsSpacing": {
        "allowArgPrecedingWhitespaces": 1,
        "allowArgTrailingWhitespaces": 0,
        "exceptions": {
            "singleArg": {
                "allowArgPrecedingWhitespaces": 0,
                "allowArgTrailingWhitespaces": 0
            },
            "firstArg": {
                "allowArgPrecedingWhitespaces": 0
            },
            "lastArg": {
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