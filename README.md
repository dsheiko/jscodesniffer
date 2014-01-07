JSCodeSniffer v.2.x
==============
[![Build Status](https://travis-ci.org/dsheiko/jscodesniffer.png)](https://travis-ci.org/dsheiko/jscodesniffer)
[![NPM version](https://badge.fury.io/js/jscodesniffer.png)](http://badge.fury.io/js/jscodesniffer)

JSCodeSniffer is a node.js application that validates JavaScript sources against provided coding style, just like phpcs.
One can define a custom coding style by using described below JSON notation or use one of predefined standards.


## Features
* Tool is available as UMD (can be used with nodejs or as a RequireJS module)
* Predefined popular coding styles (jQuery Coding Style Guide, Idiomatic Style Manifesto)
* Reports in the style of phpcs
* Solution ready for Continuous Integration
    - Provided Git pre-commit hook script
    - Provided SVN pre-commit hook script
    - Provided Grunt task
    - Provided Jenkins CheckStyle report
* Custom standard can be easily configured by using JSON notation
* Scripts can be associated to a coding style in block comments using @jscs tag
* Relaxing options can be provided with real-time configuration (.jscsrc) per project



## Setup

JS_CodeSniffer relies on node.js. If you don't have node.js installed, just follow the instructions:
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

Make sure all the required dependencies installed
```bash
npm i
```
Make sure the binary is executable
```bash
chmod +x jscs
```
You can also create a symlink to make it globally available
```bash
ln -s jscs /usr/local/bin/jscs
```

## Using JSCodeSniffer in the command line

Simply get detailed report on the file coding style according to Idiomatic Style Manifesto
```bash
./jscs source-code.js
```

![JS CodeSniffer Full Report Example](https://raw.github.com/dsheiko/jscodesniffer/master/doc/sample1.jpg "JS CodeSniffer Full Report Example")

Get detailed report on the coding style for all *.js/*.json files of the 'lib' folder according to jQuery Coding Style Guide
```bash
./jscs lib --standard=Jquery
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

Setting up [Apache Ant](http://ant.apache.org/) build script reporting to [Jenkins](http://jenkins-ci.org) Checkstyle plugin.
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

## Using JSCodeSniffer as RequireJS (AMD) module
...


## Setting up [Grunt](http://gruntjs.com/) task

*Gruntfile.js*
```javascript
grunt.loadNpmTasks('grunt-jscs');
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
    "grunt-jscs": ">0.0.1"
  }
```

## Environments

Standard to sniff against can be enforced on the file by following instructions directly in the code
```javascript
/* @jscs standard:Jquery */
```

## Using the Subversion pre-commit hook

A pre-commit hook is a feature available in the Subversion version control system that allows code to be validated before it is committed to the repository.
Edit scripts/jscs-svn-pre-commit and replace JSCS value with your own path to JS CodeSniffer
```bash
JSCS = "/your-path/jscodesniffer"
```

Make a symlink of scripts/jscs-svn-pre-commit in your repository hooks folder. E.g.
```bash
ln -s /<full path>/scripts/jscs-svn-pre-commit /repositories/<project>/hooks/pre-commit
```

## Using the git pre-commit hook
Make a symlink of scripts/jscs-git-pre-commit in your repository .git/hooks folder. E.g.
```bash
ln -s /<full path>/scripts/jscs-git-pre-commit /<project>/.git/hooks/pre-commit
```

## Declaring coding style
Standard declaration are located in standard directory. You can store there in a file named after your custom standard name
rule-sets that you want your code be validated against. To make the notation available for AMD/RequireJs, wrap the JSON into UMD ...

NOTE: Conventions 'Any ; used as a statement terminator must be at the end of the line' and 'Multi-line Statements is checked'
are tested by JSHint and therefore not provided with sniffs

```javascript
{
 /*
		Indentation with tabs.
	*/
		"Indentation": {
			"allowOnlyTabs": true,
			"allowOnlySpaces": false
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
			"disallowPrecedingSpaces": true
		},
		"SemicolonPunctuatorSpacing": {
			"disallowPrecedingSpaces": true
		},
		/*
			if/else/for/while/try always have braces and always go on multiple lines.
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
				"CallExpression",
				"FunctionDeclaration",
				"FunctionExpression"
			],
			"allowWhitespaces": false
		},
		/*
		 Any : after a property name in an object definition must not have preceding space
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
			"allowPrecedingPropertyWhitespaces": 0,
			"allowOnePerLineWhenMultilineCaller": true
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

  }
```