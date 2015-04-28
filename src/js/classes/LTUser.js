(function ( global ) {
global.LT = global.LT || {};	// Namespace

/**
 * User class.
 * @param {number} id       Identifier.
 * @param {string} email    Email of the account.
 * @param {string} password Passwod of the account.
 */
LT.User = function ( id, email, password ) {
	this._id = id;						// Identifier of the user
	this._email = email;				// Email of the account
	this._password = md5( password );	// Password of the user
	this._notebooks = [];				// Array of notebooks
};

// Methods
LT.User.prototype = {
	/* TODO */
};
}) ( window );