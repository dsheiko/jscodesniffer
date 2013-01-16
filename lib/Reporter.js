/*
 * @package JS_CodeSniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var util = require("./Util"),
    fs = require('fs'),
    path = require('path'),
    config = JSON.parse( fs.readFileSync(
        path.join(__dirname, '/../package.json'), 'utf-8' ) ),

    Reporter = function( options ) {
        var formatters = {
                summary: (function(){
                    var fileCount = 0, errorCount = 0;
                    return {
                        header: function() {
                            var hrPlain = util.repeatStr( "-", options.width ) + "\n";
                            return "\n JS CODE SNIFFER " + config.version + " REPORT SUMMARY\n" +
                                hrPlain +
                                " FILE" + util.repeatStr( " ", options.width - 12 ) + "ERRORS  \n" +
                                hrPlain;
                        },
                        report: function( path, messages, standard ) {
                            if ( !messages.length ) {
                                return '';
                            }
                            fileCount ++;
                            errorCount += messages.length;
                            return " " + util.sprintf( "%" + ( options.width - 9 ) + "s", path ) + ' ' + messages.length + "\n";
                        },
                        footer: function() {
                            var hrPlain = util.repeatStr( "-", options.width ) + "\n";
                            return hrPlain +
                                " A TOTAL OF " + errorCount + " ERROR(S) WERE FOUND IN " + fileCount + " FILE(S)\n" +
                                hrPlain;
                        }
                    };
                }()),
                trace: {
                    header: function() {
                        return '';
                    },
                    report: function( path, messages, standard ) {
                        var header = "\n FILE: " + path + "\n" +
                                    util.repeatStr( "-", options.width ) + "\n";
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
                    report: function( path, messages, standard ) {
                        var hrPlain = util.repeatStr( "-", options.width ) + "\n",
                            hrStarred = "+" + util.repeatStr( "-", options.width - 1 ) + "\n",
                            header = "\n [color:light red]FILE: " + path + " violates " + standard + " standard [/color]\n" +
                                   hrPlain +
                                    " FOUND " + messages.length + " ERROR(S)\n" +
                                    hrStarred +
                                    " LINE  | COLUMN   | MESSAGE \n" +
                                    hrStarred,
                            footer = hrPlain + "\n",
                            out = '';
                        if ( !messages.length ) {
                            return '';
                        }
                        out += ( header );
                        messages.forEach(function( log ){
                            var message = util.wordwrap( log.message, options.width - 22 );
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
                    report: function( path, messages, standard ) {
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
            },
            reports = [],
            formatter = formatters[ options.format || "full" ],
            /**
             * Replace [color:red]..[/color] with console color codes
             * @param string markdown
             * @return string
             */
            interpretateMarkup = function( markup, options ) {
                var matches = markup.match( /\[color:[a-z\s]+\]/gm ),
                    colors = {};
                matches && matches.forEach(function( match ){
                    var color = match.replace( /\[color:([a-z\s]+)\]/, "$1" );
                    colors[ color ] = color;

                });
                colors && Object.keys( colors ).forEach(function( color ) {
                    var re = new RegExp( "(\\[color:" + color + "\\])", "gm" ),
                        code = util.CONSOLE_COLORS[ color ] || util.CONSOLE_COLORS.white;
                   if ( options && options.highlight === false ) {
                       markup = markup.replace( re, "" );
                   } else {
                       markup = markup.replace( re, "\033[" + code + "m" );
                   }
                });
                if ( options && options.highlight === false ) {
                    markup = markup.replace( /(\[\/color\])/gm, "" );
                } else {
                    markup = markup.replace( /(\[\/color\])/gm, util.CONSOLE_RESET_COLOR );
                }
                return markup;
            };
        return {
            add: function( path, messages, standard ) {
                reports.push({
                    path: path,
                    messages: messages,
                    standard: standard
                });
            },
            print: function( options ) {
                var out = '';
                reports.forEach(function( report ){
                    out += formatter.report( report.path, report.messages, report.standard );
                });
                out = out ? formatter.header() + out + formatter.footer() : '';
                return interpretateMarkup( out, options );
            }
        };
    };

module.exports = Reporter;