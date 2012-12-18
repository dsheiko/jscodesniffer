
// 2.B.1.3
// var statements should always be in the beginning of their respective scope (function).
// Same goes for const and let from ECMAScript 6.

// Bad
function foo() {
foo();
  // some statements here

  var bar = "",
    qux;
}

// Good
function foo() {
  var bar = "",
    qux;

  // all statements after the variables declarations.
}