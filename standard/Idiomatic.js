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
define( function ( require, exports, module ) {
  /**
    * Rules based on https://github.com/rwaldron/idiomatic.js/
    */
  return {
  /*
    Never mix spaces and tabs.
  */
    "Indentation": {
      "allowOnlyTabs": true,
      "allowOnlySpaces": true
    },
  /*
    No whitespace at the end of line or on blank lines.
  */
  "LineSpacing": {
    "allowLineTrailingSpaces": false
  },
  /*
    Lines should be no longer than 80 characters
    */
    "LineLength": {
      "allowMaxLength": 80
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
      No filler spaces in empty constructs (e.g., {}, [], fn())
      */
    "EmptyConstructsSpacing": {
      "for": [
        "ObjectExpression",
        "ArrayExpression",
        "CallExpression"
      ],
      "allowWhitespaces": false
    },

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
    /*
      jQuery uses double quotes.
      */
    "QuoteConventions": {
      "allowDoubleQuotes": true,
      "allowSingleQuotes": false
    },
    /*
      Variable and function names should be full words, using camel case with a lowercase first letter.
      */
    "VariableNamingConventions": {
      "allowCase": ["camel"],
      "allowRepeating": true,
      "allowNumbers": true
    },
    "FunctionNamingConventions": {
      "allowCase": ["camel", "pascal"],
      "allowRepeating": true,
      "allowNumbers": true
    },

    "ArgumentsSpacing": {
      "allowArgPrecedingWhitespaces": 1,
      "allowArgTrailingWhitespaces": 1,
      "exceptions": {
        "singleArg" : {
          "for": [ "FunctionExpression", "ArrayExpression", "ObjectExpression" ],
          "allowArgPrecedingWhitespaces": 0,
          "allowArgTrailingWhitespaces": 0
        },
        "firstArg": {
          "for": [ "FunctionExpression" ],
          "allowArgPrecedingWhitespaces": 0
        },
        "lastArg": {
          "for": [ "FunctionExpression" ],
          "allowArgTrailingWhitespaces": 0
        }
      }
    },
    "ParametersSpacing": {
      "allowParamPrecedingWhitespaces": 1,
      "allowParamTrailingWhitespaces": 1
    },
    /*
      When a chain of method calls is too long to fit on one line, there must be one call per line,
      with the first call on a separate line from the object the methods are called on.
      If the method changes the context, an extra level of indentation must be used.
      */
    "ChainedMethodCallsSpacing" : {
      "allowTrailingObjectWhitespaces": 0,
      "allowPrecedingPropertyWhitespaces": 0
    },

    "OperatorSpacing" : {
      "allowOperatorPrecedingWhitespaces": 1,
      "allowOperatorTrailingWhitespaces": 1
    },
    /*
      Assignments in a declaration must be on their own line. Declarations that don't have an assignment
      must be listed together at the start of the declaration
      */
    "VariableDeclarationPerScopeConventions" : {
      "disallowMultiplePerBlockScope": true
    }

  };
});