/*jshint -W068 */
var Formatter = require( "../lib/Formatter/Checkstyle" ),

    normalize = function( out ) {
      var re = /\s+/g,
        rel = /^\s+/g,
        rer = /\s+$/g;
      return out.replace( re, " " ).replace( rel, "" ).replace( rer, "" );
    };

require( "should" );

describe( "Formatter/Checkstyle.js", function () {

    describe( "(methods)", function () {
        var formatter,
        messages = [{
        errorCode: "errorCode",
        message: "message",
        sniff: "sniff",
        range: [0,1],
        loc: {
          start: {
            "line": 1,
            "column": 0
          },
          end: {
            "line": 1,
            "column": 1
          }
        },
        payload: {
          expected: 0,
          actual: 1
        }
        }];

      beforeEach(function(){
        formatter = new Formatter({ version: "1", reportWidth: 62 });
      });


      it("header must render intended output", function () {
        normalize( formatter.header() ).should.eql( "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <checkstyle version=\"1\">" );
      });
      it("report must render intended output", function () {
        normalize( formatter.report( "sample.js", messages ) ).should.eql( "<file name=\"sample.js\"> " +
        "<error line=\"1\" column=\"0\" source=\"errorCode\" severity=\"error\" message=\"message\" /> </file>" );
      });
      it("footer must render intended output", function () {
        normalize( formatter.footer() ).should.eql( "</checkstyle>" );
      });

    });

});
