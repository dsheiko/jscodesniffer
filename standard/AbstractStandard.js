/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var util = require('../lib/Util'),
    AbstractStandard = function() {
        this.exceptions = {};
        this.extendExceptionMap = function( obj ) {
            Object.keys( obj ).forEach( function( prop ){
                this.exceptions[ prop ] = obj[ prop ];
            }, this );
        };
        this.log = function( token, exceptionCode ) {
            if ( typeof this.exceptions[ exceptionCode ] === "undefined" ) {
                throw new Error( "Exception description missing for the code " + exceptionCode );
            }
            this.logger.log(
                [ this.exceptions[ exceptionCode ], "[color:yellow]" + token.value + "[/color]" ],
                exceptionCode, token.line, token.column
            );
        };
    };

module.exports = AbstractStandard;