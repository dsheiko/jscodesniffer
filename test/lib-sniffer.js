var should = require('should'),
    fixture = require('./inc/fixture'),
    Sniffer = require('../lib/Sniffer');


describe( "Sniffer", function () {

  describe( "findJscsConfigInComments", function () {
    var sniffer = new Sniffer();
    it( "must extract standard name from block comments", function () {
      var tree = fixture.getJson( "Sniffer/case1.json" );
      sniffer.findJscsConfigInComments( tree.comments ).should.eql( "Jquery" );
    });
  });

});
