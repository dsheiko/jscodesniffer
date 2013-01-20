JS_CodeSniffer
==============

JS_CodeSniffer is a node.js application that tokenises and "sniffs" JavaScript files to detect violations of a defined coding standard. It is an essential development tool that ensures your code remains clean and consistent.
A coding standard in JS_CodeSniffer is a collection of sniff files. Each sniff checks one part of the coding standard only. The default coding standard used by JS_CodeSniffer is the Idiomatic Style Manifesto (https://github.com/rwldrn/idiomatic.js).

STATUS: 1.0.2

JS Sniffer online available at http://jscodesniffer.dsheiko.com

## Setup

JS_CodeSniffer relies on node.js. If you don't have node.js installed, just follow the instructions:
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

Make sure all the required dependencies installed
```
npm i
```
Make sure the binary is executable
```
chmod +x jscs
```
You can also create a symlink to make it globally available
```
ln -s jscs /usr/local/bin/jscs
```

## Usage

Simply get detailed report on the file coding style according to Idiomatic Style Manifesto
```
./jscs source-code.js
```

![JS CodeSniffer Full Report Example](https://raw.github.com/dsheiko/jscodesniffer/master/doc/sample1.jpg "JS CodeSniffer Full Report Example")

Get detailed report on the coding style for all *.js/*.json files of the 'lib' folder according to jQuery Coding Style Guide
```
./jscs lib --standard=Jquery
```

Get summary report
```
./jscs lib --report-summary
```
![JS CodeSniffer Summary Report Example](https://raw.github.com/dsheiko/jscodesniffer/master/doc/sample2.jpg "JS CodeSniffer Summary Report Example")

Get XML report (which allows you to parse the output easily and use the results in your own scripts)
```
./jscs lib --report-xml
```

## Environments

Standard to sniff against can be enforced on the file by following instructions directly in the code
```
/* @jscs standard:Jquery */
```

## Using the Subversion pre-commit hook

A pre-commit hook is a feature available in the Subversion version control system that allows code to be validated before it is committed to the repository.
Edit scripts/jscs-svn-pre-commit and replace JSCS value with your own path to JS CodeSniffer
```
JSCS = "/your-path/jscodesniffer"
```

Make a symlink of scripts/jscs-svn-pre-commit in your repository hooks folder. E.g.
```
ln -s /<full path>/scripts/jscs-svn-pre-commit /repositories/<project>/hooks/pre-commit
```

## Using the git pre-commit hook
Make a symlink of scripts/jscs-git-pre-commit in your repository .git/hooks folder. E.g.
```
ln -s /<full path>/scripts/jscs-git-pre-commit /<project>/.git/hooks/pre-commit
```


## Following sniffs implemented

### Idiomatic Style Manifesto:

* Identifier naming convention
  * Constructors must be on PascalCase and other identifiers of camelCase
  * Neither Pascal nor CamelCase allows repeating uppercase characters
  * Both allow but only trailing digits

```
var camelCase,
    camelCase1,
    PascalCaseIdentifier = function(){},
    obj = { PascalCaseIdentifier: function(){} };
```

* Liberal spacing on operators (Arithmetic Operators, Assignment Operators, Bitwise Operators, Comparison Operators, Logical Operators)

```
num >> 0;
num >>> 0;
length === 0;
```

* Liberal spacing on primitive type literals ( Boolean, Date, Number, RegExp,  String)

```
var num = 42,
    str = "string",
    re = /A-Z/,
    coercion = 42 + "string" + null;
```

* Liberal spacing on function arguments

```
foo( 1, 2, 3 );
foo([ "alpha", "beta" ]);
foo({
  a: "alpha",
  b: "beta"
});
foo("bar");
```

* Liberal spacing within grouping parenthesis

```
if ( !("foo" in obj) ) {
}
```

* Single var statement per scope

```
var foo = "",
    bar = "",
    quux = function() {
        var foo;
    };
```


### JQuery Core Style Guidelines:

* Identifier naming convention
* Liberal spacing on operators (Arithmetic Operators, Assignment Operators, Bitwise Operators, Comparison Operators, Logical Operators)
* Liberal spacing on primitive type literals ( Boolean, Date, Number, RegExp,  String)
* Liberal spacing on function arguments
  * If inside other function call, no spaces wrapping the expression allowed otherwise grouping parens must have one padding space
  * Functions, object literals, array literals and string literals go snug to front and back of the parentheses when it's the only argument
  * Multi-line function/object/array literals go snug at end
