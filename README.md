JSCodeSniffer v.2.x
==============

[![Join the chat at https://gitter.im/dsheiko/jscodesniffer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dsheiko/jscodesniffer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM](https://nodei.co/npm/jscodesniffer.png)](https://nodei.co/npm/jscodesniffer/)

[![Build Status](https://travis-ci.org/dsheiko/jscodesniffer.png)](https://travis-ci.org/dsheiko/jscodesniffer)
[![Bower version](https://badge.fury.io/bo/jscodesniffer.svg)](http://badge.fury.io/bo/jscodesniffer)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dsheiko/jscodesniffer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

JSCodeSniffer is a node.js application that checks JavaScript code style consistency according to a provided coding style, just like phpcs.
One can define a custom coding style by using described below JSON notation or use one of predefined standards.


## Features
* Tool is available as UMD (can be used [with nodejs](#a-use) or as a [RequireJS module](#a-amd))
* Predefined popular coding styles ([jQuery Coding Style Guide](http://contribute.jquery.org/style-guide/js/), [Idiomatic Style Manifesto](https://github.com/rwaldron/idiomatic.js/))
* Reports in the style of [phpcs](https://github.com/squizlabs/PHP_CodeSniffer)
* Solution ready for [Continuous Integration](#a-ci)
    - Provided [Git pre-commit hook script](#a-git)
    - Provided [SVN pre-commit hook script](#a-svn)
    - Provided [Grunt task](#a-grunt)
    - Provided [Jenkins CheckStyle report](#a-ant)
* Custom standard [can be easily configured](#a-standard) by using JSON notation
* Scripts can be associated to a coding style in block comments [using `jscs` tag](#a-env)
* Relaxing options can be provided with [real-time configuration](#a-realtime) (`.jscsrc`) per project
* Ignore list can be provided with [`.jscsignore`](#a-jscsignore)  per project
* Thoroughly covered with automated tests: 200+ unit-tests, 70+ integration tests

## Install
You have at least three installation options:
### Download or clone the Git repository
```
git clone https://github.com/dsheiko/jscodesniffer.git
```
### Install by using Node.js Package Manager
```
sudo npm  install jscodesniffer -g
```
### Install by using Bower.io Package Manager
```
bower install --save jscodesniffer
```

## <a name="a-use"></a> Using JSCodeSniffer in the command line

Simply get detailed report on a target (file or directory) coding style according to jQuery Coding Style Guide
```bash
./jscs source-code.js --standard=Jquery  --report-full
```
or
```bash
node jscs.js source-code.js  --standard=Jquery  --report-full
```
or
```bash
./jscs js/dir1 file1.js js/dir2 file2.js --standard=Jquery  --report-full
```

![JS CodeSniffer Full Report Example](https://raw.github.com/dsheiko/jscodesniffer/master/doc/sample1.jpg "JS CodeSniffer Full Report Example")

Get detailed report on the coding style for all *.js/*.json files of the 'lib' folder according to jQuery Coding Style Guide
```bash
./jscs lib --standard=Jquery --report-full
```

Get summary report
```bash
./jscs lib --report-summary
```
![JS CodeSniffer Summary Report Example](https://raw.github.com/dsheiko/jscodesniffer/master/doc/sample2.jpg "JS CodeSniffer Summary Report Example")

Get XML report (which allows you to parse the output easily and use the results in your own scripts)
```bash
./jscs lib --report=xml
```

Get Checkstyle report (that is supported by wide range of 3rd party software. E.g. Jenkins via a plugin)
```bash
./jscs lib --report=checkstyle
```

Report to a file (by default report goes to stdout)
```bash
./jscs lib --report-file=filePath
```

Disable colors in the report
```bash
./jscs lib --highlight=0
```

Define width of report screen
```bash
./jscs lib --reportWidth=84
```


## <a name="a-amd"></a> Using JSCodeSniffer as RequireJS (AMD) module

1. Install the package or download and unpack it into you project folder

```bash
 npm i jscodesniffer
```

2. Use RequireJS to load required modules

```javascript
require( [ "<esprima-js-path>/esprima", "<pkg-path>/lib/Sniffer", "<pkg-path>/lib/Dictionary/en", "<pkg-path>/lib/Dictionary" ], function( esprima, Sniffer, en, Dictionary ) {
  var sniffer = new Sniffer( esprima ),
      dictionary = new Dictionary( en ),
      logger, messages;

    // Get sniffer report
    logger = sniffer.getTestResults( node.srcCode.value, { standard: "Jquery" } ),
    // Translate messages
    messages = dictionary.translateBulk( logger.getMessages(), true );
    // Output report
    console.log( messages );
});
```


## <a name="a-env"></a> Environments

Standard to sniff against can be enforced on the file by following instructions directly in the code
```javascript
/* jscs standard:Jquery */
```
Old form introduced in version 1.x.x is also supported
```javascript
/* @jscs standard:Jquery */
```

## <a name="a-realtime"></a> Real-Time Configuration

Adjusting options can be provided as manual standard in `.jscsrc` file placed in the root of your project.
JSCodesniffer will search upward recursively until it finds any. It will extend the specified standard rule-sets
with the defenitions provided in this real-time configuration file. `.jscsrc` syntax is pretty much the same as standard
defenition file except it doesn't need to be UMD (just JSON). I you need disable particular rule-sets you can simply
empty rule-set configurations:

```bash
{
  "Indentation": false,
  "QuoteConventions": false
}
```

## <a name="a-jscsignore"></a> .jscsignore

Specifies files to ignore in the same format as [`.gitignore`](http://git-scm.com/docs/gitignore)

With `.jscsignore` in project root directory:
```bash
standard/**/*.js
```

The code sniffer produces following output:
```bash
 node jscs.js ./standard --standard=Jquery
 * `standard/Idiomatic.js` ignored in concordance with .jscsignore
 * `standard/Jquery.js` ignored in concordance with .jscsignore
 JsCodeSniffer 2.1.15 (https://github.com/dsheiko/jscodesniffer)
```

## <a name="a-standard"></a> Declaring coding style
Standard declaration are located in `standard` directory. You can store there in a file named after your custom standard name
the rule-sets that you want your code be validated against. To make the defenition available for AMD/RequireJs, the JSON notation is supposed
to be wrapped as a UMD module.

NOTE: Conventions 'Any ; used as a statement terminator must be at the end of the line' and 'Multi-line Statements is checked'
are tested by JSHint and therefore not provided with sniffs (See [http://contribute.jquery.org/style-guide/js/#linting] for details).

```javascript
{
  /*
    defines what characters allowed for line indentation
  */
    "Indentation": {
      "allowOnlyTabs": true,
      "allowOnlySpaces": true,
      "disallowMixed": true,
      "ignoreBlockComments": true
    },
  /*
    defines if trailing spaces allowed for lines
  */
    "LineSpacing": {
      "allowLineTrailingSpaces": false
    },
  /*
    defines allowed range for line length
  */
    "LineLength": {
      "allowMaxLength": 80,
      "allowMinLength": 0
    },
  /*
    defines spacing conventions for comma punctuator
    Example:
    // good
    var foo, bar;
    // bad
    var foo , bar;
  */
    "CommaPunctuatorSpacing": {
      "disallowPrecedingSpaces": false
    },
  /*
    defines spacing conventions for semicolon punctuator
    Example:
    // good
    var foo;
    // bad
    var foo ;
  */
    "SemicolonPunctuatorSpacing": {
      "disallowPrecedingSpaces": false
    },

  /*
    defines scoping rules for compound statements

    Example:
    // good
    if ( true ) {
      var foo = "bar";
    }
    // bad
    if ( true ) var foo = "bar";

    All the constrains are optional.
    if ( true )__{..}, for (..)__{..} - opening brace preceding whitespace
    if ( true ) {__..}, for (..){__..} - opening brace trailing whitespace
    if ( true ) {..__}, for (..){..__} - closing brace preceding whitespace
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
      "requireMultipleLines": true,
      "allowOpeningBracePrecedingWhitespaces": 1,
      "allowOpeningBraceTrailingWhitespaces": 1,
      "requireOpeningBracePrecedingNewLine": true,
      "requireOpeningBraceTrailingNewLine": true,
      "allowClosingBracePrecedingWhitespaces": 1,
      "requireClosingBracePrecedingNewLine": true
    },
    /*
    defines spacing conventions for unary expressions

    Example:
    !!100 // good
    !! 100 // bad
    */
    "UnaryExpressionIdentifierSpacing": {
      "allowTrailingWhitespaces" : 0
    },
    /*
    defines spacing conventions for ternary conditionals

    Example:
    foo = true ? 1 : 0; // good
    foo = true ?1:0; // bad
    */
    "TernaryConditionalPunctuatorsSpacing": {
      "allowTestTrailingWhitespaces": 1,
      "allowConsequentPrecedingWhitespaces": 1,
      "allowConsequentTrailingWhitespaces": 1,
      "allowAlternatePrecedingWhitespaces": 1,
       /*
        Optional modifier.
        When undefined the sniffer treats nesting statements the same
            as regular
        When false, no rules applied for nesting statements
        When defined, the corresponding rules go for nesting statements
        foo( a?b:c )
        */
      "ifNesting": {
        "allowTestTrailingWhitespaces": 0,
        "allowConsequentPrecedingWhitespaces": 0,
        "allowConsequentTrailingWhitespaces": 0,
        "allowAlternatePrecedingWhitespaces": 0
      }
    },
    /*
    defines spacing conventions for empty constructs
    "for" qualifier takes an array of tokens compatible with
    Mozilla Parser AST (https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API)

    Example:
    obj = {}; // good
    obj = {  }; // bad
    */
    "EmptyConstructsSpacing": {
      "for": [
        "ObjectExpression",
        "ArrayExpression",
        "CallExpression"
      ],
      "allowWhitespaces": false
    },
   /*
    defines spacing conventions for object literals

    Example:
    obj = { prop: 1 }; // good
    obj = { prop:1 };// bad
    */
    "ObjectLiteralSpacing": {
      "allowKeyPrecedingWhitespaces": 1,
      "allowKeyTrailingWhitespaces": 0,
      "allowValuePrecedingWhitespaces": 1,
      "allowValueTrailingWhitespaces": 1
    },
   /*
    defines spacing conventions for array literals

    Example:
    arr = [ 1, 2 ]; // good
    arr = [1,2]; // bad
    */
    "ArrayLiteralSpacing": {
      "allowElementPrecedingWhitespaces": 1,
      "allowElementTrailingWhitespaces": 1,
      /*
      Optional modifier.
      "for" qualifier takes an array of tokens compatible with
      Mozilla Parser AST (https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API)
      When qualifier "for" is missing the exception rules gets applied for any node type
      */
      "exceptions": {
        "singleElement": {
          "for": [ "Literal" ],
          "allowElementPrecedingWhitespaces": 0,
          "allowElementTrailingWhitespaces": 0
        },
        "firstElement": {
          "for": [ "Literal" ],
          "allowElementPrecedingWhitespaces": 1
        },
        "lastElement": {
          "for": [ "Literal" ],
          "allowElementTrailingWhitespaces": 1
        }
      }
    },
   /*
    defines type of quotes to use across the code-base

    Example:
    foo = "text"; // good
    foo = 'text'; // bad
    */
    "QuoteConventions": {
      "allowDoubleQuotes": true,
      "allowSingleQuotes": false
    },
    /*
    defines naming conventions for variables
    Note: variable of all uppercase (including $_0-9) are considered as constants and ignored by the sniffer

    Example:
    var camelCase; // good
    var not_camel_case; // bad
    */
    "VariableNamingConventions": {
      "allowCase": ["camel"],
      "allowRepeating": true,
      "allowNumbers": true
    },
   /*
    defines naming conventions for functions

    Example:
    var PascalCase; // good
    var not_camel_or_pascal_case; // bad
    */
    "FunctionNamingConventions": {
      "allowCase": ["camel", "pascal"],
      "allowRepeating": true,
      "allowNumbers": true
    },
    /*
    defines naming conventions for new expressions

    Example:
    obj = new Constructor(); // good
    obj = new constructor(); // bad
    */
    "NewExpressionCalleeNamingConventions": {
      "allowCase": [ "pascal" ],
      "allowRepeating": true,
      "allowNumbers": true
    },

   /*
    defines spacing conventions for arguments

    Example:
    fn( 1, 2 ); // good
    fn(1,2); // bad
    */
    "ArgumentsSpacing": {
      "allowArgPrecedingWhitespaces": 1,
      "allowArgTrailingWhitespaces": 1,
      /*
        Optional modifier.
       "for" qualifier takes an array of tokens compatible with
        Mozilla Parser AST (https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API)
        When qualifier "for" is missing the exception rules gets applied for any node type
      */
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
      },
      /*
        Optional modifier.
        When undefined the sniffer treats nesting statements the same
            as regular
        When false, no rules applied for nesting statements
        When defined, the corresponding rules go for nesting statements
        foo( bar(1,1) )
        */
      "ifNesting": {
        "allowArgPrecedingWhitespaces": 0,
        "allowArgTrailingWhitespaces": 0
      }
    },
  /*
    defines spacing conventions for parameters

    Example:
    function fn( foo, bar ){}; // good
    function fn(foo,bar){}; // bad
    */
    "ParametersSpacing": {
      "allowParamPrecedingWhitespaces": 1,
      "allowParamTrailingWhitespaces": 1,
      "exceptions": {
        "singleParam": {
          "for": [ "Identifier" ],
          "allowParamPrecedingWhitespaces": 0,
          "allowParamTrailingWhitespaces": 0
        },
        "firstParam": {
          "for": [ "Identifier" ],
          "allowParamPrecedingWhitespaces": 1,
          "allowParamTrailingWhitespaces": 0
        },
        "lastParam": {
          "for": [ "Identifier" ],
          "allowParamPrecedingWhitespaces": 1
          "allowParamTrailingWhitespaces": 0
        }
      }
    },
    /*
    defines how methods can be placed when a chain of method calls is too long to fit on one line

    Example:
    // good
    elements
    .addClass( "foo" )
    .children();

    // bad
    elements.addClass( "foo" )
    .children();
    */

    "ChainedMethodCallsPerLineConventions": {
      "requireOnePerLineWhenMultilineCaller": true
    },
    /*
    defines spacing conventions for chains of method calls
    Example:
    // good
    elements.addClass( "foo" )

    // bad
    elements.  addClass( "foo" )
    */
    "ChainedMethodCallsSpacing": {
      "allowPrecedingPropertyWhitespaces": 0
    },
    /*
    defines spacing conventions for operators (including declarator)

    Example:
    foo = 1 + 1; // good
    foo = 1+1; // bad
    */
    "OperatorSpacing" : {
      "allowOperatorPrecedingWhitespaces": 1,
      "allowOperatorTrailingWhitespaces": 1
    },
    /*
    defines conventions for variable declarations

    Example:
    // good
    (function(){
      var foo, bar;
    })();

    // bad
    (function(){
      var foo;
      var bar;
    })();
    */
    "VariableDeclarationPerScopeConventions" : {
      "disallowMultiplePerBlockScope": true,
      "requireInTheBeginning": true
    },
    /*
    defines conventions for object declarations

    Example:
    // good
    o = { p1: 1, p2: 2 }
    // good
    o = {
      p1: 1,
      p2: 2
    }
    // bad
    o = {
      p1: 1, p2: 2 }
     */
    "ObjectLiteralConventions": {
      "requireOnePerLineWhenMultiline": true
    },
    /*
    defines conventions for array declarations

    Example:
    // good
    arr = [ 1, "two" ]
    // good
    arr = [
      1,
      "two"
    ]
    // bad
    arr = [
      1, "two" ]
    */
    "ArrayLiteralConventions": {
      "requireOnePerLineWhenMultiline": true
    }
  }
```

# <a name="a-ci"></a>JSCodeSniffer and Continuous Integration

## <a name="a-ant"></a>Setting up [Apache Ant](http://ant.apache.org/) build script reporting to [Jenkins](http://jenkins-ci.org) Checkstyle plugin.
NOTE: If you have phpcs-ci ant target, invoke it prior to this one. Jscs will find created by phpcs checkstyle.xml and extend its body instead of overriding the report.
```xml
<target name="jscs-ci"
         description="Find coding standard violations using JS_CodeSniffer and print human readable output.">
  <exec executable="jscs">
   <arg value="--standard=Jquery" />
   <arg value="--report=checkstyle" />
   <arg value="--report-file=${basedir}/build/logs/checkstyle.xml" />
   <arg path="${basedir}/src" />
  </exec>
 </target>
```

## <a name="a-grunt"></a>Setting up [Grunt](http://gruntjs.com/) task

*Gruntfile.js*
```javascript
grunt.loadNpmTasks('grunt-jscodesniffer');
grunt.initConfig({
     // Validate against jQuery coding standard
     jscs: {
        options: {
            "standard": "Jquery"
        },
        all: ["js-folder"]
     }
  });
```
*package.json*
```javascript
"devDependencies": {
    //..
    "grunt-jscodesniffer": "*"
  }
```

## <a name="a-svn"></a> Using the Subversion pre-commit hook

A pre-commit hook is a feature available in the Subversion version control system that allows code to be validated before it is committed to the repository.
Edit scripts/jscs-svn-pre-commit and replace JSCS value with your own path to JS CodeSniffer
```bash
JSCS = "/your-path/jscodesniffer"
```

Make a symlink of scripts/jscs-svn-pre-commit in your repository hooks folder. E.g.
```bash
ln -s /<full path>/scripts/jscs-svn-pre-commit /repositories/<project>/hooks/pre-commit
```

## <a name="a-git"></a> Using the git pre-commit hook
Make a symlink of scripts/jscs-git-pre-commit in your repository .git/hooks folder. E.g.
```bash
ln -s /<full path>/scripts/jscs-git-pre-commit /<project>/.git/hooks/pre-commit
```


## API Notes

High-level interface example (the report in stdout):
```javascript
var argv = [ "node", "jscs", "./source-dir/", "--standard=Jquery", "--report-full" ],
		jscodesniffer = require( "jscodesniffer" );

jscodesniffer( argv, process.cwd() );
```

Low-level one example:
```javascript
var Sniffer = require( "./lib/Sniffer" ),
		sniffer = new Sniffer(),
		src = "var a= 1;",
		options = {
			standard: "Jquery"
		},
		logger = sniffer.getTestResults( src, options, {} );

console.log(logger.getMessages());

/*
  [ { sniff: 'OperatorSpacing',
    errorCode: 'OperatorPrecedingWhitespaces',
    range: [ 5, 5 ],
    loc: {  start: { line: 1, column: 5 }, end: { line: 1, column: 5 }  },
    payload:
     { actual: 0,
       expected: 1,
       excerpt: '',
       trace: '..a=..',
       where: '<' } } ]

*/
```

## Developing a sniff

Let's consider a sniff, which validates the number of spaces preceding parameter list in a function declaration.
First of all, we need to apply the defined rules to function declarations only. Syntax Tree gives us
precise information about any function declaration in the code. As the sniff will rely on Syntax Tree we
place the new module to /Lib/Sniff/SyntaxTree and name it according to the defined
rule-set `FunctionDeclarationParameterListSpacing` (has to be also presented in `SyntaxAnalizer`).

Every sniff module has method `validateRule`. There we simply enlist the option validators:
```
utils.validateRule( rule, "allowPrecedingWhitespaces", "number", true );
```

Method `run` performs the sniffing job. There we lop off all the inappropriate nodes (`node.type === "FunctionDeclaration"`).
Now we have to determine what the node parts correspond to the rule. In this case we need
function identifier (`node.id`) and the following token representing opening parenthesis. Unfortunately the Syntax Tree
doesn't contain any information about such tokens as grouping parentheses. However we can ask TokenIterator for help.
Let's get the token corresponding to the function identifier:
```
tokenIt = tokenIterator.findByLeftPos( node.id.range[ 0 ] );
```
Now we can simply request the token following this one as `tokenIt.get( 1 )` (and preceding as `tokenIt.get( -1 )`.
So the spaces of our interest are expected between those two tokens. We can make sure we point to the right code
fragment like that:

```
sourceCode.extract( node.id.range[ 1 ], tokenIt.get( 1 ).range[ 0 ] ).print();
```

to make the real check, we use the following mixin:
```
mixin.sniffExcerpt( node.id, tokenIt.get( 1 ),
  rule.allowPrecedingWhitespaces, "FunctionDeclarationParamListPrecedingSpacing", "<" );
```

[![Analytics](https://ga-beacon.appspot.com/UA-1150677-13/dsheiko/jscodesniffer)](http://githalytics.com/dsheiko/jscodesniffer)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dsheiko/jscodesniffer/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

