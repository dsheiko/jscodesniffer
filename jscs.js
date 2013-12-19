var MIN_REPORT_WIDTH = 32,
    DEFAULT_REPORT_WIDTH = 84,
    Sniffer = require('./lib/Sniffer'),
    Reporter = require('./lib/Reporter'),
    Dictionary = require('./lib/Dictionary'),
    Cli = require('./lib/Cli'),
    fs = require('fs'),
    path = require('path'),
    HELP_SCREEN = "Usage: jscs <path>\n" +
      "<path> - filename or dir to sniff\n" +
      "[--standard=<Standard>] - apply specified standard (Idiomatic, Jquery)\n" +
      "[--report-full] - full report with source codes\n" +
      "[--report-summary] - summary report\n" +
      "[--report=xml] - printing an XML report\n" +
      "[--report=checkstyle] - printing Jenkins-friendly checkstyle report\n" +
      "[--report-file=filePath] - write the report to the specified file path\n" +
      "[--highlight=0] - disable colors on reports\n" +
      "[reportWidth=" + DEFAULT_REPORT_WIDTH + "] - How many columns wide screen reports should be printed\n";



var
    /**
     * Default options
     */
    options = {
      standard: null,
      highlight: "1",
      report: "summary",
      reportWidth: DEFAULT_REPORT_WIDTH
    },
    stdout,
    reporter,
    formatter,
    sniffer,
    existingReportBody,
    rulesetOverrides,
    where = ".",
    cli = new Cli( fs, path );


try {

  if ( process.argv.length < 3 ) {
    console.log( HELP_SCREEN );
    process.exit( 1 );
  }

  where = cli.findPathInCliArgs( process.argv );
  options = cli.parseCliOptions( process.argv, options );

  if ( options.hasOwnProperty( "help" ) ) {
    console.log( HELP_SCREEN );
    process.exit( 1 );
  }

  options.version = cli.getProjectInfo().version;

  if ( options.reportWidth < MIN_REPORT_WIDTH ) {
      options.reportWidth = DEFAULT_REPORT_WIDTH;
  }

  if ( options.hasOwnProperty( "report-full" ) ) {
    options.report = "full";
  }

  if ( options.hasOwnProperty( "report-summary" ) ) {
    options.report = "summary";
  }

  if ( options.report === "checkstyle" || options.report === "xml" ) {
    options.highlight = "0";
  }

  reporter = new Reporter();
  sniffer = new Sniffer();
  dictionary = new Dictionary();

  rulesetOverrides = cli.readLocalConfig( "." );

  cli.applyToEveryFileInPath( where , function( pathArg, data ) {
      logger = sniffer.getTestResults( data, options, rulesetOverrides );
      reporter.add( pathArg, dictionary.translateBulk( logger.getMessages() ), options.standard );
  });

  if ( options.report === "checkstyle" && typeof options["report-file"] !== "undefined" ) {
     existingReportBody = cli.extractExistingReportBody( options["report-file"] );
  }

  formatter = reporter.loadFormatter( options.report, options );
  stdout = reporter.print( formatter, ( options.highlight === "1" ), existingReportBody );

  if ( stdout.length ) {
    if ( typeof options["report-file"] !== "undefined" ) {
        fs.writeFileSync( options["report-file"], stdout, 'utf-8' );
    } else {
        console.error( stdout );
    }
    process.exit( 1 );
  }

} catch ( e ) {
  console.error( e );
}












