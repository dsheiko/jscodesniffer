module.exports = {
    Token: function( l, c ){
      return {
        line: l || 0,
        column: c || 0
      };
    },
    Context: function( sL, sC, eL, eC ){
      return {
        start: {
          line: sL || 0,
          column: sC || 0
        },
        end: {
          line: eL || 0,
          column: eC || 0
        }
      };
    }
};