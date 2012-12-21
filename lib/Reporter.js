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
            formatter = formatters[ format ],
            CONSOLE_COLORS = {
                black: '0;30',
                darkGray: '1;30',
                blue: '0;34',
                lightBlue: '1;34',
                green: '0;32',
                lightGreen: '1;32',
                cyan: '0;36',
                lightCyan: '1;36',
                red: '0;31',
                lightRed: '1;31',
                purple: '0;35',
                lightPurple: '1;35',
                brown: '0;33',
                yellow: '1;33',
                lightGray: '0;37',
                white: '1;37'
            },
            parseColors = function( markdown ) {
                var matches = markdown.match( /\[color:[a-z]+\]/gm ),
                    colors = {};
                matches.forEach(function( match ){
                    var color = match.replace(/\[color:([a-z]+)\]/, "$1");
                    colors[ color ] = color;
                    
                });
                Object.keys( colors ).forEach(function( color ) {
                    var re = new RegExp("(\\[color:" + color + "\\])", "gm"),
                        code = CONSOLE_COLORS[ color ] || CONSOLE_COLORS[ "white" ];
                   markdown = markdown.replace( re, "\\033[" + code + "m"  );
                });
                markdown = markdown.replace( /\[\/color\]/, "\\033[0m" );
                return markdown;
            };
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
                    footer = "------------------------------------------------------------------------------------\n",
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
                var out = '  <file name="' + path + '" errors="' + messages.length + '" warnings="0">' + "\n";
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