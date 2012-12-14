var Token = function( data ) {
        Object.keys( data ).forEach(function( prop ){
            this[ prop ] = data[ prop ];
        }, this);
        this.scope = null;
        this.group = null;
        this.parent = null;
        /**
        * @param array/string type
        * @param array arrOfValues OPTIONAL
        */
        this.match = function( type, arrOfValues ) {
            if ( Array.isArray( type ) ) {
                return type.indexOf( this.type ) !== -1;
            } else if ( typeof arrOfValues === "undefined" ) {
                return this.type === type;
            } else {
                return this.type === type && arrOfValues.indexOf( this.value ) !== -1;
            }
        };
    };

module.exports = Token;