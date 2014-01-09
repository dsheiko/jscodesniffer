/*jshint -W068 */
var utils = require( "../lib/Utils" );
require( "should" );


describe( "Utils.js", function () {

    describe( "(methods)", function () {

        it("color must colorize a given string", function () {
          utils.color( "red", "-" ).should.eql( "\u001b[0;31m-\u001b[0m" );
        });
        it("sprintf - case 1", function () {
          utils.sprintf( "..%s..", "A1", "A2" ).should.eql( "..A1.." );
        });
        it("sprintf - case 2", function () {
          utils.sprintf( "..%s..%s..", "A1", "A2" ).should.eql( "..A1..A2.." );
        });
        it("sprintf - case 3", function () {
          utils.sprintf( "..%3s..", "A1", "A2" ).should.eql( "..A1 .." );
        });

        it("repeatStr", function () {
          utils.repeatStr( "-", 3 ).should.eql( "---" );
        });

        it("repeatStr", function () {
          utils.wordwrap( "The quick brown fox jumped over the lazy dog.", 20 )
            .should.eql( "The quick brown fox \njumped over the lazy \ndog. " );
        });

        it("extend", function () {
          var recObj = { foo: 1 } , payload = { bar: 1 };
          utils.extend( recObj, payload );
          recObj.should.eql( { foo: 1, bar: 1 } );
        });


    });

    describe( "ucfirst", function () {
      it("must capitalize the first character of the string", function () {
          utils.ucfirst( "method" ).should.eql( "Method" );
        });
    });

});
