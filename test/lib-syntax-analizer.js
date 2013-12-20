var should = require('should'),
    fixture = require('./inc/fixture'),
    SyntaxAnalizer = require('../lib/SyntaxAnalizer');


describe( "SyntaxAnalizer", function () {


  describe( "traverseSyntaxTree", function () {
    var analizer = new SyntaxAnalizer();
    it( "must iterate through the entire tree", function () {
      var out = [],
          expectedNode = null;
          tree = fixture.getJson( "ParametersSpacing/case1.json" );
      analizer.traverseSyntaxTree( tree, function( node, pNode ){
        out.push( node );
        if ( node.type === "Identifier" && node.name === "a" ) {
          expectedNode = pNode;
        }
      });
      out.shift().type.should.eql( "Program" );
      out.pop().type.should.eql( "BlockStatement" );
      expectedNode.type.should.eql( "FunctionExpression" );
    });
  });

});
