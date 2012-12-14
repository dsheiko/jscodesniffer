var HIGHLIGHTING_OPEN = '\033[1;36m',
    HIGHLIGHTING_CLOSE = '\033[0m',
    AbstractStandard = function() {
        this.exceptions = {};
        this.extendExceptionMap = function( obj ) {
            Object.keys( obj ).forEach(function( prop ){
                this.exceptions[ prop ] = obj[ prop ];
            }, this);
        };
        this.log = function( token, exceptionCode ) {
            if ( typeof this.exceptions[ exceptionCode ] === "undefined" ) {
                throw new Error( "Exception description missing for the code " + exceptionCode );
            }
            this.logger.log(
                [ this.exceptions[ exceptionCode ], HIGHLIGHTING_OPEN + token.value + HIGHLIGHTING_CLOSE ],
                exceptionCode, token.line, token.position
            );
        };
    };

module.exports = AbstractStandard;