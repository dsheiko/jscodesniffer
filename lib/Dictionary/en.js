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
    "ObjectPropertyKeyPrecedingSpacing" : "There must be [color:underline]{expected}[/color] whitespace(s) preceding object property key; [color:yellow]{actual}[/color] found",
    "ObjectPropertyKeyTrailingSpacing" : "There must be [color:underline]{expected}[/color] whitespace(s) trailing object property key; [color:yellow]{actual}[/color] found",
    "ObjectPropertyValuePrecedingSpacing" : "There must be [color:underline]{expected}[/color] whitespace(s) preceding object property value; [color:yellow]{actual}[/color] found",
    "ObjectPropertyValueTrailingSpacing" : "There must be [color:underline]{expected}[/color] whitespace(s) trailing object property value; [color:yellow]{actual}[/color] found",
    "FunctionNamingConventions" : "Function names must be in [color:underline]{expected}[/color] case.",
    "FunctionNamingRepeatingUppercase" : "Function names must not have repeating uppercase.",
    "FunctionNamingNumbersNotAllowed" : "Function names must not have numbers.",
    "VariableNamingConventions" : "Variable names must be in [color:underline]{expected}[/color] case; [color:yellow]'{actual}'[/color] found",
    "VariableNamingRepeatingUppercase" : "Variable names must not have repeating uppercase.",
    "VariableNamingNumbersNotAllowed" : "Variable names must not have numbers.",
    "UnaryExpressionValueTrailingSpacing" : "There must be [color:underline]{expected}[/color] whitespace(s) trailing unary expression; [color:yellow]{actual}[/color] found",
    "CompoundStatementRequireBraces": "Compound statements require braces",
    "CompoundStatementRequireMultipleLines": "Compound statements always go on multiple lines",

    "TernaryConditionalTestTrailingWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) preceding '?' punctuator; [color:yellow]{actual}[/color] found",
    "TernaryConditionalConsequentPrecedingWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) trailing '?' punctuator; [color:yellow]{actual}[/color] found",
    "TernaryConditionalConsequentTrailingWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) preceding ':' punctuator; [color:yellow]{actual}[/color] found",
    "TernaryConditionalAlternatePrecedingWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) trailing ':' punctuator; [color:yellow]{actual}[/color] found",

    "EmptyConstructsSpacing": "There must be no whitespaces in empty constructs; [color:yellow]{actual}[/color] found",
    "ArraylElementPrecedingSpacing" : "There must be [color:underline]{expected}[/color] whitespace(s) preceding array element; [color:yellow]{actual}[/color] found",
    "ArraylElementTrailingSpacing" : "There must be [color:underline]{expected}[/color] whitespace(s) trailing array element; [color:yellow]{actual}[/color] found",
    "QuoteConventionsDoubleQuotesNotAllowed" : "Double quotes not allowed for wrapping string literals",
    "QuoteConventionsSingleQuotesNotAllowed" : "Single quotes not allowed for wrapping string literals",


    "ParamPrecedingWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) preceding parameter; [color:yellow]{actual}[/color] found",
    "ParamTrailingWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) trailing parameter; [color:yellow]{actual}[/color] found",
    "ArgPrecedingWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) preceding argument; [color:yellow]{actual}[/color] found",
    "ArgTrailingWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) trailing argument; [color:yellow]{actual}[/color] found",

    "ChainedMethodCallsTrailingObjectWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) trailing object; [color:yellow]{actual}[/color] found",
    "ChainedMethodCallsPrecedingPropertyWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) preceding property; [color:yellow]{actual}[/color] found",
    "MultipleVarDeclarationPerBlockScope": "There must be [color:underline]{expected}[/color] variable declaration(s) per block scope; [color:yellow]{actual}[/color] found",

    "OperatorPrecedingWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) preceding operator; [color:yellow]{actual}[/color] found",
    "OperatorTrailingWhitespaces": "There must be [color:underline]{expected}[/color] whitespace(s) trailing operator; [color:yellow]{actual}[/color] found",
    "OnlyTabsAllowedForIndentation" : "There must be used only tabs in indentation",
    "OnlySpacesAllowedForIndentation" : "There must be used only spaces in indentation",
    "LineTrailingSpacesNotAllowed" : "There must be no line trailing spaces; [color:yellow]{actual}[/color] found",
    "ExceededLineMaxLength": "There must be maximum [color:underline]{expected}[/color] characters of line length; [color:yellow]{actual}[/color] found",
    "DeceedLineMinLength": "There must be minimum [color:underline]{expected}[/color] characters of line length; [color:yellow]{actual}[/color] found",

    "CommaPrecedingSpacesNotAllowed": "No spaces preceding comma punctuator allowed",
    "SemicolonPrecedingSpacesNotAllowed": "No spaces preceding semicolon punctuator allowed",

    "":""
  };
});