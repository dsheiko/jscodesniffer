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
   var code = "a = {\n\
	a: 1,\n\
	supportedInputProps: (function() {\n\
					var inputElem = document.createElement( \"input\" ),\n\
						attrs = (function( props ) {\n\
							var i = 0, attrs = [], len = props.length;\n\
							for ( ; i < len; i++ ) {\n\
								attrs[ props[i] ] = !!(props[i] in inputElem);\n\
							}\n\
							return attrs;\n\
						})(\"autocomplete autofocus list placeholder max min multiple pattern required step\"\n\
							.split( \" \" ));\n\
					return attrs;\n\
				}())\n\
}";
		//console.log(code);
    logger = sniffer.getTestResults( code, OPTIONS );
    console.log(logger.getMessages());
  });

});


