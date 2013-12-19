/*
 * @package jscodesniffer
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === 'object' && typeof define !== 'function' ) {
    var define = function ( factory ) {
        module.exports = factory( require, exports, module );
    };
}
define( function ( require, exports, module ) {
  return {
    "IndentationWithTabs" : "Only tabs allowed for indentation",
    "IndentationWithSpaces" : "Only spaces allowed for indentation",
    "ObjectPropertyKeyPrecedingSpacing" : "There must be {expected} whitespace(s) preceding object property key; {actual} found",
    "ObjectPropertyKeyTrailingSpacing" : "There must be {expected} whitespace(s) trailing object property key; {actual} found",
    "ObjectPropertyValuePrecedingSpacing" : "There must be {expected} whitespace(s) preceding object property value; {actual} found",
    "ObjectPropertyValueTrailingSpacing" : "There must be {expected} whitespace(s) trailing object property value; {actual} found",
    "FunctionNamingConventions" : "Function names must be in {expected} case.",
    "FunctionNamingRepeatingUppercase" : "Function names must not have repeating uppercase.",
    "FunctionNamingNumbersNotAllowed" : "Function names must not have numbers.",
    "VariableNamingConventions" : "Variable names must be in {expected} case.",
    "VariableNamingRepeatingUppercase" : "Variable names must not have repeating uppercase.",
    "VariableNamingNumbersNotAllowed" : "Variable names must not have numbers.",
    "UnaryExpressionValueTrailingSpacing" : "There must be {expected} whitespace(s) trailing unary expression; {actual} found",
    "CompoundStatementRequireBraces": "Compound statements require braces",
    "CompoundStatementRequireMultipleLines": "Compound statements always go on multiple lines",

    "TernaryConditionalTestTrailingWhitespaces": "There must be {expected} whitespace(s) preceding '?' punctuator; {actual} found",
    "TernaryConditionalConsequentPrecedingWhitespaces": "There must be {expected} whitespace(s) trailing '?' punctuator; {actual} found",
    "TernaryConditionalConsequentTrailingWhitespaces": "There must be {expected} whitespace(s) preceding ':' punctuator; {actual} found",
    "TernaryConditionalAlternatePrecedingWhitespaces": "There must be {expected} whitespace(s) trailing ':' punctuator; {actual} found",

    "EmptyConstructsSpacing": "There must be no whitespaces in empty constructs; {actual} found",
    "ArraylElementPrecedingSpacing" : "There must be {expected} whitespace(s) preceding array element; {actual} found",
    "ArraylElementTrailingSpacing" : "There must be {expected} whitespace(s) trailing array element; {actual} found",
    "QuoteConventionsDoubleQuotesNotAllowed" : "Double quotes not allowed for wrapping string literals",
    "QuoteConventionsSingleQuotesNotAllowed" : "Single quotes not allowed for wrapping string literals",


    "ParamPrecedingWhitespaces": "There must be {expected} whitespace(s) preceding parameter; {actual} found",
    "ParamTrailingWhitespaces": "There must be {expected} whitespace(s) trailing parameter; {actual} found",
    "ArgPrecedingWhitespaces": "There must be {expected} whitespace(s) preceding argument; {actual} found",
    "ArgTrailingWhitespaces": "There must be {expected} whitespace(s) trailing argument; {actual} found",

    "ChainedMethodCallsTrailingObjectWhitespaces": "There must be {expected} whitespace(s) trailing object; {actual} found",
    "ChainedMethodCallsPrecedingPropertyWhitespaces": "There must be {expected} whitespace(s) preceding property; {actual} found",
    "MultipleVarDeclarationPerBlockScope": "There must be {expected} variable declaration(s) per block scope; {actual} found",

    "OperatorPrecedingWhitespaces": "There must be {expected} whitespace(s) preceding operator; {actual} found",
    "OperatorTrailingWhitespaces": "There must be {expected} whitespace(s) trailing operator; {actual} found",
    "OnlyTabsAllowedForIndentation" : "There must be used only tabs in indentation",
    "OnlySpacesAllowedForIndentation" : "There must be used only spaces in indentation",
    "LineTrailingSpacesNotAllowed" : "There must be no line trailing spaces; {actual} found",
    "ExceededLineMaxLength": "There must be maximum {expected} characters of line length; {actual} found",
    "DeceedLineMinLength": "There must be minimum {expected} characters of line length; {actual} found",

    "CommaPrecedingSpacesNotAllowed": "No spaces preceding comma punctuator allowed",
    "SemicolonPrecedingSpacesNotAllowed": "No spaces preceding semicolon punctuator allowed",

    "":""
  };
});