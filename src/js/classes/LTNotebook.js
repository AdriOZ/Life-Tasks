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
	}
};
}) ( window );