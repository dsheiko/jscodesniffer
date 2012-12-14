JS_CodeSniffer
==============

Tokenises JavaScript files and detects violations of a defined set of coding standards

STATUS: Pre-alpha

Following sniffs implemented:

Idiomatic Coding Style:

* Identifier naming convention
** Constructors must be on PascalCase and other identifiers of camelCase
** Neither Pascal nor CamelCase allows repeating uppercase characters
** Both allow but only trailing digits

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