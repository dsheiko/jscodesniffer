module.exports = function() {
  return {
    messages: [],
    publish: function( channel, sniff, errorCode, range, loc, payload ) {
      this.messages.push( {
        errorCode: errorCode,
        sniff: sniff,
        range: range,
        loc: loc,
        payload: payload
      });
    },
    getMessages: function() {
      return this.messages.length ? this.messages : false;
    },
    getMessage: function( errorCode ) {
      var res = this.messages.filter( function( msg ) {
        return msg.errorCode === errorCode;
      });
      return res.length ? res[ 0 ] : false;
    }
  };
};