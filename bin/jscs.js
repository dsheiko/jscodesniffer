#!/usr/bin/env node
var main = require( "../jscs-module" );

try {
 main( process.argv, process.cwd() );
} catch ( err ) {
  console.error( err.message || err );
}
