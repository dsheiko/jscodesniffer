/*jshint -W068 */
var Mediator = require( "../lib/Mediator" );

require( "should" );
describe( "Mediator", function () {

      var mediator;

      beforeEach(function(){
        mediator = new Mediator();
      });

      describe( "subscribe/publish", function () {
        it("must implement pub/sub pattern", function () {
          var out = null;
          mediator.subscribe( "ch1", function( a1, a2, a3 ){
            out = [ a1, a2, a3 ];
          });
          mediator.publish( "ch1", 1, 2, 3 );
          out.should.eql([ 1, 2, 3 ]);
        });

      });


});
