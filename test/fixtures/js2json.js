/**
 /*
 * Utility to build files contaning esprima syntax trees based on found in a given dir source code files
 * Example:
 * > node js2json.js QuoteConventions
 * > ../case1.ok.json created
 * > ../case1.fail.json created
 */
var fs = require('fs'),
    path = require('path'),
    esprima = require('esprima'),
    fPath = path.resolve( __dirname, process.argv[ 2 ] ),
    dir,
    jsToJson = function( pathArg, file ) {
      var re = /\.js$/g,
          reR = /\r/g,
          srcCode = fs.readFileSync( path.resolve( pathArg, file ), 'utf-8' ).replace( reR, "" ),
          destFullPath = path.resolve( pathArg, file.replace( re, ".json") );


      tree = esprima.parse( srcCode, {
          range: true,
          tokens: true,
          loc: true
        });

      if ( tree ) {
        fs.writeFileSync( destFullPath, JSON.stringify( tree ), 'utf-8' );
        console.log( destFullPath + " created" );
      }
    };


dir = fs.readdirSync( fPath );
if ( dir ) {
  dir.forEach( function( file ){
      var stat, re = /\.js$/gi;
      stat = fs.statSync( path.resolve( fPath, file ) );
      stat.isFile() && re.test( file ) && jsToJson( fPath, file );
  });
} else {
  console.error( "No files in " + fPath );
}
