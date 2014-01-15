var /** @var {fixture} */
		fixture = require( "./fixture" );
		/**
		 *
		 * @module helper
		 * @param {string} caseSuiteName
		 */
    module.exports = function( caseSuiteName ){
      return {
        /**
				*
				* @param {number} caseId
				* @returns {string}
				*/
			 getCode: function( caseId ) {
				 return fixture.getText( caseSuiteName + "/" + caseId + ".js" );
			 },
			 /**
				*
				* @param {number} caseId
				* @returns {Object}
				*/
			 getTree: function( caseId ) {
				 return fixture.getJson( caseSuiteName + "/" + caseId + ".json" );
			 }
      };
  };