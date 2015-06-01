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
				notebook = this._notebooks[ i ];
			}
			i++;
		}
		return notebook;
	},

	/**
	 * Returns the notebook at the spicific index.
	 * @param  {number} index Index of the required notebook.
	 * @return {LT.Notebook|null}       Returns the required notebook or null if it
	 *                             it doesn't exist.
	 */
	getNotebookByIndex: function ( index ) {
		return typeof this._notebooks[ index ] === 'undefined'
				? null
				: this._notebooks[ index ];
	},

	/**
	 * Unsets the notebook with the specific id.
	 * @param  {number} id Identifier of the notebook.
	 */
	unsetNotebookById: function ( id ) {
		var newNotebooks = [];		// New array of notebooks.

		for ( var i in this._notebooks ) {
			if ( this._notebooks[ i ]._id != id ) {
				newNotebooks.push( this._notebooks[ i ] );
			}
		}
		this._notebooks = newNotebooks;
	},

	/**
	 * Executes the callback for each notebook.
	 * @param  {Function} callback Function that will be executed.
	 */
	forEachNotebook: function ( callback ) {
		for ( var i in this._notebooks ) {
			callback( this._notebooks[ i ] );
		}
	},

	/**
	 * Returns an array with all notes that are not active in all
	 * notebooks.
	 * @return {object} Array of notes that are not active.
	 */
	getDeletedNotes: function () {
		var tmp = null,		// Save the deleted notes for each notebook
			deleted = [];	// Save all not active notes
		for ( var i in this._notebooks ) {
			tmp = this._notebooks[ i ].getDeletedNotes();
			for ( var j in tmp ) {
				deleted.push( tmp[ j ] );
			}
		}
		return deleted;
	},

	/**
	 * Sets a new password.
	 * @param {string} password New value for the password.
	 */
	setPassword: function ( password ) {
		this._password = md5( password );
	},

	/**
	 * Returns the total number of deleted notes.
	 * @return {number} Sum of the number of deleted notes of all notebooks.
	 */
	numberOfDeletedNotes: function () {
		var counter = 0;
		for ( var i in this._notebooks ) {
			counter += this._notebooks[ i ].numberOfDeletedNotes();
		}
		return counter;
	},

	/**
	 * Indicates if there is a notebook called with that name.
	 * @param  {string} name Name of the notebook.
	 * @return {boolean}      Returns true if the notebooks exists and false
	 *                        if not.
	 */
	notebookExists: function ( name ) {
		for ( var i in this._notebooks ) {
			if ( this._notebooks[ i ]._name === name ) {
				return true;
			}
		}
		return false;
	},

    /**
     * Search a note and the notebook that contains the note.
     * @param id_note Identifier of the note.
     * @returns {*[]} Notebook in the first position and note in the second
     *                position.
     */
    getNotebookAndNote: function ( id_note ) {
        var tmpNote = null;

        // Search
        for ( var i in this._notebooks ) {
            if ( tmpNote = this._notebooks[ i ]
                    .getNoteById( id_note ) ) {
                return [ this._notebooks[ i ], tmpNote ];
            }
        }
    },

	/**
	 * Returns a string representation of the user.
	 * @return {string} String representation of the user.
	 */
	toString: function () {
		return JSON.stringify(
			{
				id: this._id,
				email: this._email,
				password: this._password
			}
		);
	},

	/**
	 * JSON representation of the user.
	 * @return {string} JSON representation of the user.
	 */
	toJSON: function () {
		return JSON.stringify(
			{
				id: this._id,
				email: this._email,
				password: this._password,
				notebooks: this._notebooks
			}
		);
	}
};
}) ( window );