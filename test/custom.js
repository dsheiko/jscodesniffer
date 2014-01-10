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
   var code = "jQuery.unique(\n\
				jQuery.merge( this.get(), jQuery( selector, context ) )\n\
			)";
    logger = sniffer.getTestResults( code, OPTIONS );
    console.log(logger.getMessages());
    //logger.getMessages().hasErrorCode("CompoundStatementRequireMultipleLines").should.be.ok;
  });

});


