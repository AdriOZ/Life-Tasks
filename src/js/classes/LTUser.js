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
	/**
	 * Creates a new notebook.
	 * @param {LT.Notebook} notebook Notebook to be added.
	 */
	addNotebook: function ( notebook ) {
		if ( !( notebook instanceof LT.Notebook ) ) {
			throw 'notebook must be an instance of LT.Notebook';
		}
		this._notebooks.push( notebook );
	},

	/**
	 * Returns the notebook with the required id.
	 * @param  {number} id Identifier of the notebook.
	 * @return {LT.Notebook|null}    Returns the required notebook or null if
	 *                               it doesn't exist.
	 */
	getNotebookById: function ( id ) {
		var notebook = null,				// Required notebook
			i = 0,							// Counter
			len = this._notebooks.length;	// Length of the array of Notebooks

		while ( !notebook && i < len ) {
			if ( this._notebooks[ i ]._id == id ) {
				notebook = this._notebooks;
			}
			i++;
		}

		return notebook;
	}
};
}) ( window );