JS_CodeSniffer
==============

Tokenises JavaScript files and detects violations of a defined set of coding standards
JS_CodeSniffer is a nodeJs application that tokenises and "sniffs" JavaScript files to detect violations of a defined coding standard. It is an essential development tool that ensures your code remains clean and consistent.
A coding standard in JS_CodeSniffer is a collection of sniff files. Each sniff checks one part of the coding standard only. The default coding standard used by JS_CodeSniffer is the Idiomatic Style Manifesto (https://github.com/rwldrn/idiomatic.js).

STATUS: 0.1.0 Beta

## Setup

Just make sure all the required dependencies installed
```
npm i
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
