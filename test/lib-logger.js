var should = require('should'),
    Logger = require('../lib/Logger');


describe('Logger', function () {

      var logger;

      beforeEach(function(){
        logger = new Logger();
      });

      describe('log', function () {
        it('must store given state', function () {
          logger.log( "sniff", "errorCode", "range", "loc", "payload" );
          logger.getMessages()[ 0 ].should.eql({
            sniff: 'sniff',
            errorCode: 'errorCode',
            range: 'range',
            loc: 'loc',
            payload: 'payload'
          });
        });

      });


});
