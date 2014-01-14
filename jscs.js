var main = require( "./jscs-module" );
try {
 main( process.argv, process.cwd() );
} catch ( e ) {
  console.error( e );
}
