var should = require('../node_modules/should/should'),
    Reporter = require('../lib/Reporter');


describe('Reporter.js', function () {

    describe('(methods)', function () {
      var reporter, out;
       it('interpretateMarkup must translate markup', function () {
         reporter = new Reporter();
         out = reporter.interpretateMarkup( "[color:light red]-[/color]", true );
         out.should.eql( "[1;31m-[0m" );
         out = reporter.interpretateMarkup( "[color:light red]-[/color]", false );
         out.should.eql( "-" );
       });

       it('loadFormatter must make an instance of reporter', function () {
         var require = function( name ) {
           // Constructor
           return function() {
             // Prototype
             return {
               get: function() {
                 return name;
               }
             };
           };
         };
         reporter = new Reporter( require );
         reporter.loadFormatter( "xml" ).get().should.eql( "./Formatter/Xml" );
       });

       it('add must collect report data', function () {
         reporter = new Reporter();
         reporter.add( 1, 2, 3 );
         reporter.getData().should.eql( [ { path: 1, messages: 2, standard: 3 } ] );
       });

       it('print must render output using formatter', function () {
         var formatter = {
           header: function() {
             return "+";
           },
           report: function() {
             return "-";
           },
           footer: function() {
             return "+";
           }
         }
         reporter = new Reporter();
         reporter.print( formatter, false ).should.eql( "+-+" );
         reporter.print( formatter, false, "*" ).should.eql( "+*-+" );
       });

    });

});

