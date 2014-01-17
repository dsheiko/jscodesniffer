/*jshint -W068 */
var Formatter = require( "../lib/Formatter/Summary" ),

    normalize = function( out ) {
      var re = /\s+/g,
        rel = /^\s+/g,
        rer = /\s+$/g;
      return out.replace( re, " " ).replace( rel, "" ).replace( rer, "" );
    };

require( "should" );
describe( "Formatter/Summary.js", function () {

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
        normalize( formatter.header() ).should.eql( "REPORT SUMMARY ---------------" +
        "----------------------------------------------- FILE ERRORS " +
        "--------------------------------------------------------------" );
      });
      it("report must render intended output", function () {
        normalize( formatter.report( "sample.js", messages ) ).should.eql( "sample.js 1" );
      });
      it("footer must render intended output", function () {
        normalize( formatter.footer() ).should.eql( "--------------------------------------------------" +
          "------------ A TOTAL OF 0 ERROR(S) WERE FOUND IN 0 FILE(S) " +
          "--------------------------------------------------------------" );
      });

    });

});
