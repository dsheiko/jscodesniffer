/**
*
* @param {string} text
*/
module.exports = function( tokens ) {
  var key = 0,
      offset = 0,
      limit = tokens.length - 1;
  return {
     /**
      * Iterator interface
      */
      valid: function(){
        return key >= offset && key <= limit;
      },
      next: function(){
        key++;
        return this;
      },
      key: function(){
        return key;
      },
      rewind: function() {
        key = offset;
        return this;
      },
      get: function( offset ) {
          return tokens[ key + offset ];
      },
      getLast: function() {
          return tokens[ limit ];
      },
      getFirst: function() {
          return tokens[ offset ];
      }
  };
};