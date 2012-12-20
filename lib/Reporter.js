/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var util = require("./Util"),
    fs = require('fs'),
    path = require('path'),
    config = JSON.parse( fs.readFileSync(
        path.join(__dirname, '/../package.json'), 'utf-8' ) );
    Reporter = function( format ) {
        var reports = [],
            format = format || "full",
            formatter = formatters[ format ];
        return {
            add: function( path, messages ) {
                reports.push({
                    path: path,
                    messages: messages
                });
            },
            print: function() {
                var out = '';
                reports.forEach(function( report ){
                    out += formatter.report( report.path, report.messages );
                });
                return out ? formatter.header() + out + formatter.footer() : '';
            }
        };
    },
    formatters = {
        summary: (function(){
            var fileCount = 0, errorCount = 0;
            return {
                header: function() {
                    return "\n JS CODE SNIFFER " + config.version + " REPORT SUMMARY\n" +
                        "--------------------------------------------------------------------------------\n" +
                        " FILE                                                                   ERRORS  \n" +
                        "--------------------------------------------------------------------------------\n";
                },
                report: function( path, messages ) {
                    if ( !messages.length ) {
                        return '';
                    }
                    fileCount ++;
                    errorCount += messages.length;
                    return " " + util.sprintf( "%70s", path ) + ' ' + messages.length + "\n";
                },
                footer: function() {
                    return "--------------------------------------------------------------------------------\n" +
                        " A TOTAL OF " + errorCount + " ERROR(S) WERE FOUND IN " + fileCount + " FILE(S)\n" +
                        "--------------------------------------------------------------------------------\n";
                }
            }
        }()),
        trace: {
            header: function() {
                return '';
            },
            report: function( path, messages ) {
                var header = "\n" + util.color( "lightRed", " FILE: " + path ) + "\n" +
                            "------------------------------------------------------------------------------------\n";
                return header + messages;
            },
            footer: function() {
                return '';
            }
        },
        full: {
            header: function() {
                return '';
            },
            report: function( path, messages ) {
                var header = "\n" + util.color( "lightRed", " FILE: " + path ) + "\n" +
                            "------------------------------------------------------------------------------------\n" +
                            " FOUND " + messages.length + " ERROR(S)\n" +
                            "+-----------------------------------------------------------------------------------\n" +
                            " LINE  | COLUMN   | MESSAGE \n" +
                            "+-----------------------------------------------------------------------------------\n",
                    footer = "-----------------------------------------------------------------------------------\n",
                    out = '';
                if ( !messages.length ) {
                    return '';
                }
                out += ( header )
                messages.forEach(function( log ){
                    var message = util.wordwrap( log.message );
                    message = message.split("\n").join("\n       |         | ");
                    out += ( " " + util.sprintf("%5s", log.line) +
                        " | " + util.sprintf("%7s", log.column) +
                        " | " +  message + "\n" );
                });
                out += ( footer );
                return out;
            },
            footer: function() {
                return '';
            }

        },
        xml: {
            header: function() {
                return '<?xml version="1.0" encoding="UTF-8"?>' + "\n" +
                    '  <phpcs version="' + config.version + '">' + "\n";
            },
            report: function( path, messages ) {
                var out = '  <file name="/repositories/home/sheiko/vhosts/mycrysis.htdocs/index.php" errors="16" warnings="0">' + "\n";
                if ( !messages.length ) {
                    return '';
                }
                messages.forEach(function( log ){
                    out += '    <error line="' + log.line +
                        '" column="' + log.column + '" source="' + log.code +
                        '" severity="1">' + log.message +
                        '</error>' + "\n";
                });
                return out + '  </file>' + "\n";
            },
            footer: function() {
                return '</phpcs>' + "\n";
            }
        }
    };
module.exports = Reporter;