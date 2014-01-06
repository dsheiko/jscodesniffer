/*jshint -W068 */
var Cli = require("../lib/Cli");

require("should");


describe( "Cli.js", function () {


    describe( "(methods)", function () {


      beforeEach(function(){

      });

      it("getProjectInfo must read package.json", function () {
        var cli,
            fsStub = {
              readFileSync: function() {
                return "{ \"version\": \"2.0.0\" }";
              }
            },
            pathStub = {
              join: function() {
                return null;
              }
            };

        cli = new Cli( fsStub, pathStub );
        cli.getProjectInfo().should.be.ok;
        cli.getProjectInfo().version.should.eql( "2.0.0" );
        });



        it("extractExistingReportBody must extract body of the report", function () {
        var cli,
            fsStub = {
              existsSync: function() {
                return true;
              },
              readFileSync: function() {
                return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
  "<checkstyle version=\"1.1.0\">" +
    "<file></file>" +
  "</checkstyle>";
              }
            },
            pathStub = {
              join: function() {
                return null;
              }
            };

        cli = new Cli( fsStub, pathStub );
        cli.extractExistingReportBody().should.eql( "<file></file>" );
        });


        it("parseCliOptions must build options from CLI arguments", function () {
          var options,
          cli = new Cli();
          options = cli.parseCliOptions( [ "node", "jscs", "--report=xml", "--report-summary"], {} );
          options.should.eql({ report: "xml", "report-summary": null });
        });

      it("parseCliOptions must extend a given options object with found arguments", function () {
          var options = {
            highlight: 1
          },
          cli = new Cli();
          options = cli.parseCliOptions( [ "node", "jscs", "--report=xml", "--report-summary"], options );
          options.should.eql({ report: "xml", "report-summary": null, highlight: 1 });
        });


        it("applyToEveryFileInPath must read through the file structure", function () {
        var cli,
            outText = null,
            outPath = null,
            fsStub = {
              existsSync: function() {
                return true;
              },
              readFileSync: function() {
                return "test";
              },
              statSync: function() {
                return {
                  isFile: function() {
                    return true;
                  }
                };
              }
            },
            pathStub = {
              join: function() {
                return null;
              }
            };

        cli = new Cli( fsStub, pathStub );
        cli.applyToEveryFileInPath( "/tmp/", function( inPath, data ) {
          outPath = inPath;
          outText = data;
        });
        outPath.should.eql( "/tmp" );
        outText.should.eql( "test" );
        });

    });

});
