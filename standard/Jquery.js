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
    "Indentation": {
      "allowOnlyTabs": true,
      "allowOnlySpaces": true
    },

    "LineSpacing": {
      "allowLineTrailingSpaces": false
    },

    "LineLength": {
      "allowMaxLength": 80
    },

    "CommaPunctuatorSpacing": {
      "disallowPrecedingSpaces": false
    },
    "SemicolonPunctuatorSpacing": {
      "disallowPrecedingSpaces": false
    },


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
    "UnaryExpressionIdentifierSpacing": {
      "allowTrailingWhitespaces" : 0
    },

    "TernaryConditionalPunctuatorsSpacing": {
      "allowTestTrailingWhitespaces": 1,
      "allowConsequentPrecedingWhitespaces": 1,
      "allowConsequentTrailingWhitespaces": 1,
      "allowAlternatePrecedingWhitespaces": 1
    },

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

    "QuoteConventions": {
      "allowDoubleQuotes": true,
      "allowSingleQuotes": false
    },

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

    "ChainedMethodCallsSpacing" : {
      "allowTrailingObjectWhitespaces": 0,
      "allowPrecedingPropertyWhitespaces": 0
    },

    "OperatorSpacing" : {
      "allowOperatorPrecedingWhitespaces": 1,
      "allowOperatorTrailingWhitespaces": 1
    },

    "VariableDeclarationPerScopeConventions" : {
      "disallowMultiplePerBlockScope": true
    }

  };
});