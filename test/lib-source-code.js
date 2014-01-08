/*jshint -W068 */
var SourceCode = require( "../lib/SourceCode" );

require( "should" );
describe( "SourceCode", function () {


  describe( "find", function () {
    var src = new SourceCode( "Some code" );
    it( "must return correct position of the substring", function () {
      src.find( " " ).should.eql( 4 );
    });
    it( "must return -1 when no occurances of the substring found", function () {
      src.find( "#" ).should.eql( -1 );
    });
  });

  describe( "length", function () {
    var src = new SourceCode( "***" );
    it( "must return correct text length", function () {
      src.length().should.eql( 3 );
    });
  });

  describe( "filter", function () {
    var src = new SourceCode( "Some code" );
    it( "must return an instance of SourceCode with substructed substring", function () {
      src.filter( " " ).length().should.eql( 8 );
    });
  });


  describe( "asLines", function () {
    var src = new SourceCode( "*\n*\n*" );
    it( "must return array of lines", function () {
      src.asLines().should.eql( [ "*", "*", "*" ] );
    });
  });

  describe( "extract", function () {
    var src = new SourceCode( "----" );
    it( "must return an instance of SourceCode referencing given fragment", function () {
      src.extract( 1, 2 ).length().should.eql( 1 );
    });
  });


});
