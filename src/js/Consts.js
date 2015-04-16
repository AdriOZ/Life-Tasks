(function ( global ) {
global.LT = global.LT || {};	// Namespace

/**
 * Constant values
 * @type {Object}
 */
LT.Consts = {
	/* Status */
	ERROR: 0,		// Error message
	SUCCESS: 1,		// Success message

	/* Session */
	LOGIN: 0,		// Login request
	LOGOUT: 1,		// Log-out request

	/* DB */
	QUERY: 2,		// Request of searching data
	INSERT: 3,		// Request of inserting data
	UPDATE: 4,		// Request of updaing data
	DELETE: 5,		// Request of deleting data

	/* Tables */
	USERS: 0,		// Operation of users
	NOTEBOOKS: 1,	// Operation with notebooks
	NOTES: 2,		// Operation with notes
	DOCS: 3,		// Operation with documents
	REMINDERS: 4	// Operation with reminders
};
})( window );