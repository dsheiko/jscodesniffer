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

  it("-", function () {
		//var code = "fn( 1,1,bar(1,1) );";
   var code = "publish( NAME, \"SemicolonPrecedingSpacesNotAllowed\", [\n\
			token.range[ 0 ] - 1,\n\
			token.range[ 0 ]\n\
		] )";
    logger = sniffer.getTestResults( code, OPTIONS );
    console.log(logger.getMessages());
  });

});


