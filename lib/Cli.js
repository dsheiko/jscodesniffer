/*
  * @package jscodesniffer
  * @author sheiko
  * @license MIT
  * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
  * @jscs standard:Jquery
  * jshint unused:false
  * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
  */

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
    var define = function ( factory ) {
        module.exports = factory( require, exports, module );
    };
}
/**
  * A module representing Cli
  * @module Cli
  */
define(function() {
"use strict";
/**
  * CLI services
  * @constructor
  * @alias module:cli
  * @param {type} fsContainer
  * @param {type} pathContainer
  */
var Cli = function( fsContainer, pathContainer ) {
      // Dependency injection
      fsContainer = fsContainer || {};
      pathContainer = pathContainer || {};
      return {

        /**
          * Apply callback to the file
          * @param {string} pathArg
          * @param {function} fn
          */
        applyToFile: function( pathArg, fn ) {
          fn( pathArg, fsContainer.readFileSync( pathArg, "utf-8" ) );
        },
        /**
          * Apply callback to every file within the directory recursively
          * @param {string} pathArg
          * @param {function} fn
          */
        applyToEveryFileInDir: function( pathArg, fn ) {
          var that = this,
              dir = fsContainer.readdirSync( pathArg ),
              stat;
          dir && dir.forEach(function( file ){
            var re = /\.js$/gi,
                excludeRe = /\.min\.js$/gi;
            stat = fsContainer.statSync( pathArg + "/" + file );

            stat.isFile() && re.test( file ) && !excludeRe.test( file ) &&
                that.applyToFile( pathArg + "/" + file, fn );

            stat.isDirectory() && that.applyToEveryFileInDir( pathArg + "/" + file, fn );
          });
        },
        /**
          * Apply callback to every file within the path recursively
          * @param {string} pathArg
          * @param {function} fn
          */
        applyToEveryFileInPath: function( pathArg, fn ) {
          var stat,
              reNormPath = /\/+$/;

          pathArg = pathArg.replace( reNormPath, "" );
          if ( !fsContainer.existsSync( pathArg ) ) {
            throw new ReferenceError( pathArg + " doesn't exist\n" );
          }
          stat = fsContainer.statSync( pathArg );
          return stat.isFile() ? this.applyToFile( pathArg, fn ) : this.applyToEveryFileInDir( pathArg, fn );
        },
        /**
          * Get object with project info
          */
        getProjectInfo: function() {
          var project;
          try {
            project = JSON.parse( fsContainer.readFileSync(
              pathContainer.join( __dirname, "..", "package.json" ), "utf-8" ) );
          } catch ( e ) {
            throw new ReferenceError( "Cannot read package.json\n" );
          }
          return project;
        },
        /**
          * Populate options with ones founds in args
          * @param {Array} args
          * @param {object} options - reference
          * @return {string}
          */
        parseCliOptions: function( args, options ) {
          var re = /^--/g;
          args.slice( 2 ).forEach(function( arg ){
            var slices;
            if ( arg.indexOf( "--" ) === 0 ) {
              slices = arg.split( "=" );
              options[ slices[0].replace( re, "" ) ] = slices[ 1 ] || null;
            }
          });
          return options;
        },

        /**
          * Find file name or path given in CLI arguments
          * @param {Array} args
          * @return {string}
          */
        findPathInCliArgs: function( args ) {
          var out = args.slice( 2 ).filter(function( arg ){
            return arg.indexOf( "-" ) !== 0;
          });
          return out ? out.shift() : ".";
        },

        /**
          * If checkstyle already exists (e.g. built by phpcs), extend it with actual report body
          * @param {string} file
          * @return {string}
          */
        extractExistingReportBody: function( file ) {
          var data,
              // Extract body of the existing report
              re1 = /^\s*<\?xml.*?\?>/i,
              re2 = /^\s*<checkstyle.*?>/i,
              re3 = /<\/checkstyle>\s*$/i;

          if ( !fsContainer.existsSync( file ) ) {
            return "";
          }

          data = fsContainer.readFileSync( file, "utf-8" );
          return data.replace( re1, "" ).replace( re2, "" ).replace( re3, "" );
        },
        /**
          * Find in project root (any parent) directory and read local sniffer configuration
          * Just like .jshintrc
          * @param {string} pathArg
          * @returns {object}
          */
        readRealtimeConfig: function( pathArg ) {
          var LOCAL_CFG_FILE = ".jscsrc",
              parentPath,
              cfgPath = pathContainer.join( pathArg, LOCAL_CFG_FILE );

          if ( fsContainer.existsSync( cfgPath ) ){
            return JSON.parse( fsContainer.readFileSync( cfgPath, "utf-8" ) );
          }

          parentPath = pathContainer.join( pathArg, "/../" );

          if ( parentPath.length > 1 && fsContainer.statSync( parentPath ).isDirectory() ) {
            this.readRealtimeConfig( parentPath );
          }
          return {};
        }

      };
  };

  return Cli;

});