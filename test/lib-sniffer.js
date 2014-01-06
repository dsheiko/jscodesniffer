/*jshint -W068 */
var fixture = require("./inc/fixture"),
    Sniffer = require("../lib/Sniffer");

require("should");
describe( "Sniffer", function () {

  describe( "findJscsConfigInComments", function () {
    var sniffer = new Sniffer();
    it( "must extract standard name from block comments", function () {
      var tree = fixture.getJson( "Sniffer/case1.json" );
      sniffer.findJscsConfigInComments( tree.comments ).should.eql( "Jquery" );
    });
  });

});
