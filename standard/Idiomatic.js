/*
  * @package jscodesniffer
  * @author sheiko
  * @license MIT
  * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
  * @jscs standard:Jquery
  * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
  */

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
    var define = function ( factory ) {
        module.exports = factory( require, exports, module );
    };
}
define(function() {
  /**
    * Rules based on https://github.com/rwaldron/idiomatic.js/
    */
  return {

  /*
   1. Whitespace
   Never mix spaces and tabs.
  */
    "Indentation": {
      // Choose one:
      // "allowOnlyTabs": true,
      // "allowOnlySpaces": false
    },

    /*
     2. Beautiful Syntax
     */

    /*
      A. Parens, Braces, Linebreaks
      if/else/for/while/try always have spaces, braces and span multiple lines
      this encourages readability
      */
    "CompoundStatementConventions": {
      "for": [
        "IfStatement",
        "SwitchStatement",
        "WhileStatement",
        "DoWhileStatement",
        "ForStatement",
        "ForInStatement",
        "WithStatement",
        "TryStatement"
      ],
      "requireBraces": true,
      "requireMultipleLines": true
    },
    /*
     B. Assignments, Declarations, Functions ( Named, Expression, Constructor )
     Literal notations
     */
    "ObjectLiteralSpacing": {
      "allowKeyPrecedingWhitespaces": 1,
      "allowKeyTrailingWhitespaces": 0,
      "allowValuePrecedingWhitespaces": 1,
      "allowValueTrailingWhitespaces": 1
    },

    "ArrayLiteralSpacing": {
      "allowElementPrecedingWhitespaces": 1,
      "allowElementTrailingWhitespaces": 1
    },

    "EmptyConstructsSpacing": {
      "for": [
        "ObjectExpression",
        "ArrayExpression",
        "CallExpression"
      ],
      "allowWhitespaces": false
    },

    /*
     B. Assignments, Declarations, Functions ( Named, Expression, Constructor )
     Variables
     */
    "OperatorSpacing" : {
      "allowOperatorPrecedingWhitespaces": 1,
      "allowOperatorTrailingWhitespaces": 1
    },


    /*
     2.B.1.2
     Using only one `var` per scope (function) promotes readability
     and keeps your declaration list free of clutter (also saves a few keystrokes)
    */
    "VariableDeclarationPerScopeConventions" : {
      "disallowMultiplePerBlockScope": true,
      "requireInTheBeginning": true
    },

    /*
      2.B.2.1
      Named Function Declaration
     */
    "ArgumentsSpacing": {
      "allowArgPrecedingWhitespaces": 1,
      "allowArgTrailingWhitespaces": 1,
      "exceptions": {
        "singleArg" : {
          "for": [ "FunctionExpression", "ArrayExpression", "ObjectExpression", "Literal" ],
          "allowArgPrecedingWhitespaces": 0,
          "allowArgTrailingWhitespaces": 0
        },
        "firstArg": {
          "for": [ "FunctionExpression", "ArrayExpression", "ObjectExpression" ],
          "allowArgPrecedingWhitespaces": 0
        },
        "lastArg": {
          "for": [ "FunctionExpression", "ArrayExpression", "ObjectExpression" ],
          "allowArgTrailingWhitespaces": 0
        }
      }
    },
    "ParametersSpacing": {
      "allowParamPrecedingWhitespaces": 1,
      "allowParamTrailingWhitespaces": 1
    },



  /*
    Any , and ; must not have preceding space.
    */
    "CommaPunctuatorSpacing": {
      "disallowPrecedingSpaces": false
    },
    "SemicolonPunctuatorSpacing": {
      "disallowPrecedingSpaces": false
    },

    /*
      Unary special-character operators (e.g., !, ++) must not have space next to their operand.
      */
    "UnaryExpressionIdentifierSpacing": {
      "allowTrailingWhitespaces" : 0
    },
    /*
      The ? and : in a ternary conditional must have space on both sides.
      */
    "TernaryConditionalPunctuatorsSpacing": {
      "allowTestTrailingWhitespaces": 1,
      "allowConsequentPrecedingWhitespaces": 1,
      "allowConsequentTrailingWhitespaces": 1,
      "allowAlternatePrecedingWhitespaces": 1
    },



    /*
      E. Quotes
      Whether you prefer single or double shouldn't matter, there is no difference in how JavaScript parses them.
      What ABSOLUTELY MUST be enforced is consistency. Never mix quotes in the same project.
      Pick one style and stick with it.
      */
    "QuoteConventions": {
      /* Choose one:
      "allowDoubleQuotes": true,
      "allowSingleQuotes": false
      */
    },
    /*
      6.A.3.3
      Naming functions, objects, instances, etc
      */
    "VariableNamingConventions": {
      "allowCase": ["camel"],
      "allowRepeating": true,
      "allowNumbers": true
    },
    /*
      6.A.3.3
     Naming constructors, prototypes, etc.
     */
    "FunctionNamingConventions": {
      "allowCase": ["camel", "pascal"],
      "allowRepeating": true,
      "allowNumbers": true
    }


  };
});