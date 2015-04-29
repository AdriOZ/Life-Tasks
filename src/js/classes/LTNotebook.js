(function ( global ) {
global.LT = global.LT || {};	// Namespace.

/**
 * Notebook class.
 * @param {number} id   Identifier of the notebook.
 * @param {string} name Name of the notebook.
 */
LT.Notebook = function ( id, name ) {
	this._id = id;		// Identifier
	this._name = name;	// Name of the notebook
	this._notes = [];	// Array of notes.
};

// Methods
LT.Notebook.prototype = {
	/**
	 * Adds a new note to the notebook.
	 * @param {LT.Note} note Note to be added.
	 */
	addNote: function ( note ) {
		if ( !( note instanceof LT.Note ) ) {
			throw 'note must be an instance of LT.Note';
		}
		this._notes.push( note );
	},

	/**
	 * Returns the note with the specifi id.
	 * @param  {number} id Id of the note.
	 * @return {LT.Note|null}    Returns the note with the specific id or null
	 *                           if it doesn't exist.
	 */
	getNoteById: function ( id ) {
		var note = null,				// Required note
			i = 0,						// Counter
			len = this._notes.length;	// Length of the array of notes.

		while ( !note && i < len ) {
			if ( this._notes[ i ]._id == id ) {
				note = this._notes[ i ];
			}
			i++;
		}

		return note;
	},

	/**
	 * Returns the note at the specific index.
	 * @param  {number} index Index of the note.
	 * @return {LT.Note|null}       Returns the note at the specific index or null
	 *                              if it doesn't exist.
	 */
	getNoteByIndex: function ( index ) {
		return typeof this._notes[ index ] === 'undefined'
				? null
				: this._notes[ index ];
	},

	/**
	 * Executes the callback for each note.
	 * @param  {Function} callback Function that will be executed.
	 */
	forEachNote: function ( callback ) {
		for ( var i in this._notes ) {
			callback( this._notes[ i ] );
		}
	},

	/**
	 * Unsets the note with the specific id.
	 * @param  {numeber} id Identifier of the note.
	 */
	unsetNoteById: function ( id ) {
		var newNotes = [];		// New array of notes.

		for ( var i in this._notes ) {
			if ( this._notes[ i ]._id != id ) {
				newNotes.push( this._notes[ i ] );
			}
		}

		this._notes = newNotes;
	},

	/**
	 * Import an array of serialized notes.
	 * @param  {object} notes Array of JSON parsed notes.
	 */
	importNotes: function ( notes ) {
		var aux;	// Import the notes.

		for ( var i in notes ) {
			aux = new LT.Note(
				notes[ i ].id,
				notes[ i ].title,
				notes[ i ].content,
				notes[ i ].active
			);
			// Importing documents and reminders
			aux.importDocuments( notes[ i ].documents );
			aux.importReminders( notes[ i ].reminders );

			// Adding to the notebook
			this._notes.push( aux );
		}
	},

	/**
	 * Returns a string representation of the notebook.
	 * @return {string} String representation of the notebook.
	 */
	toString: function () {
		return JSON.stringify(
			{
				id: this._id,
				name: this._name
			}
		);
	},

	/**
	 * Returns a JSON representation of the notebook.
	 * @return {string} JSON representation of the notebook.
	 */
	toJSON: function () {
		return JSON.stringify(
			{
				id: this._id,
				name: this._name,
				notes: this._notes
			}
		);
	}
};
}) ( window );