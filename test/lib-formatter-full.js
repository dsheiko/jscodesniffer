/*jshint -W068 */
var Formatter = require( "../lib/Formatter/Full" ),

    normalize = function( out ) {
      var re = /\s+/g,
        rel = /^\s+/g,
        rer = /\s+$/g;
      return out.replace( re, " " ).replace( rel, "" ).replace( rer, "" );
    };

require( "should" );
describe( "Formatter/Full.js", function () {

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


      it("report must render intended output", function () {
        normalize( formatter.report( "sample.js", messages ) ).should.eql( "[color:light red]FILE: sample.js " +
        "violates undefined standard [/color] -------------------------------------------------------------- " +
        "FOUND 1 ERROR(S) +------------------------------------------------------------- LINE | COLUMN | MESSAGE " +
        "+------------------------------------------------------------- 1 | 0 | [color:dark gray]sniff:[/color]" +
        " message --------------------------------------------------------------" );
      });

    });

});
