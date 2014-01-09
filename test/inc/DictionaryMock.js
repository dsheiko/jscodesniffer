module.exports = function() {
  return {
    actual: null,
    expected: null,
    getMsg: function() {
      return "";
    },
    translate: function( code, actual, expected ) {
      this.actual = actual;
      this.expected = expected;
      return "";
    }
  };
};