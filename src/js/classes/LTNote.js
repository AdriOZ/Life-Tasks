(function ( global ) {
global.LT = global.LT || {};	// Namespace.

/**
 * Class Note.
 * @param {number} id      Identifier of the note.
 * @param {string} title   Title of the note.
 * @param {string} content Content of the note.
 * @param {boolean} active  Status of the note.
 */
LT.Note = function ( id, title, content, active ) {
	this._id = id;				// Identifier.
	this._title = title;		// Title of the note.
	this._content = content;	// Content of the note.
	this._active = active;		// Status of the note.
	this._documents = [];		// Documents of the note.
	this._reminders = [];		// Reminders of the note.
};

// Methods
LT.Note.prototype = {
	/**
	 * Add a new document to the note.
	 * @param {LT.Document} doc New document to be added.
	 */
	addDocument: function ( doc ) {
		if ( !( doc instanceof LT.Document ) ) {
			throw 'doc must be an instance of LT.Document';
		}
		this._documents.push( doc );
	},

	/**
	 * Add a new reminder to the note.
	 * @param {LT.Reminder} reminder New reminder to be added.
	 */
	addReminder: function ( reminder ) {
		if ( !( reminder instanceof LT.Reminder ) ) {
			throw 'reminder must be an instance of LT.Reminder';
		}
		this._reminders.push( reminder );
	},

	/**
	 * Search the document with the specific id.
	 * @param  {number} id Identifier of the document.
	 * @return {LT.Document|null}    The required document or null if it doesn't
	 *                               exist.
	 */
	getDocumentById: function ( id ) {
		var doc = null,						// Document that will be returned.
			i = 0,							// Counter.
			len = this._documents.length;	// Length of the array.

		while ( !doc && i < len ) {
			i++;

			if ( this._documents[ i ]._id == id ) {
				doc = this._documents[ i ];
			}
		}

		return doc;
	},

	getDocumentByIndex: function ( index ) {
		// TODO
	},

	getReminderById: function ( id ) {
		// TODO
	},

	getReminderByIndex: function ( index ) {
		// TODO
	},

	activateReminders: function () {
		// TODO
	},

	deactivateReminders: function () {
		// TODO
	}
};
}) ( window );