var fs = require( "fs" ),
    path = require( "path" );
    module.exports = (function(){
      var fixturePath = path.resolve(__dirname, "..", "fixtures");
      return {
        getText: function( name ) {
          var re = /\r/gm;
          return fs.readFileSync( path.resolve( fixturePath, name ), "utf-8" ).replace( re, "" );
        },
        getJson: function( name ) {
            return JSON.parse( this.getText( name ) );
        }
      };
  }());