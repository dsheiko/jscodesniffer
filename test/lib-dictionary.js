/*jshint -W068 */
var Dictionary = require( "../lib/Dictionary" );

require( "should" );

describe( "Dictionary", function () {

      var dic;

      beforeEach(function(){
        dic = new Dictionary({ key : "There must be {expected} whitespace(s). {actual} found" });
      });

      describe( "getMsg", function () {
        it("must return message by key", function () {
          dic.getMsg( "key" ).should.eql( "There must be {expected} whitespace(s). {actual} found" );
        });

        it("must throw an exception if invalid key provided", function () {
          (function(){
            dic.getMsg( "invalid-key" );
          }).should[ "throw" ]();
        });
      });

      describe( "numToString", function () {
        it("must return \"no\" for 0", function () {
          dic.numToString( 0 ).should.eql( "no" );
        });
        it("must return \"one\" for 1", function () {
          dic.numToString( 1 ).should.eql( "one" );
        });
        it("must return \"multiple\" for >=2", function () {
          dic.numToString( 2 ).should.eql( 2 );
          dic.numToString( 200 ).should.eql( 200 );
        });
        it("must return unchanged string if one given", function () {
          dic.numToString( "string" ).should.eql( "string" );
        });
      });
      describe( "translate", function () {
        it("must return translated message by key", function () {
          dic.translate( "key", 0, 1 ).should.eql( "There must be one whitespace(s). no found" );
        });
      });

    describe( "translateBulk", function () {
      it("must populate a given object with translated messages", function () {
        var messages = [{
          errorCode: "key",
          sniff: "sniff",
          range: [0,1],
          loc: {},
          payload: {
            expected: 0,
            actual: 1
          }
          }];
        dic.translateBulk( messages )[ 0 ].message.should.eql( "There must be no whitespace(s). one found" );
      });
    });

});
