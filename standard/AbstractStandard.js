var util = require('../lib/Util'),
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
                [ this.exceptions[ exceptionCode ], util.color("yellow", token.value) ],
                exceptionCode, token.line, token.column
            );
        };
    };

module.exports = AbstractStandard;