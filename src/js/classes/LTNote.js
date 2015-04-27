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
			if ( this._documents[ i ]._id == id ) {
				doc = this._documents[ i ];
			}
			i++;
		}

		return doc;
	},

	/**
	 * Returns the document at the specific index, or null if it
	 * doesn't exists.
	 * @param  {number} index Index of the required document.
	 * @return {LT.Document|null}       Required document or null if it doesn't
	 *                                  exist.
	 */
	getDocumentByIndex: function ( index ) {
		return typeof this._documents[ index ] == 'undefined'
				? null
				: this._documents[ index ];
	},

	/**
	 * Returns the reminder with the specific id, or null
	 * if it doesn't exist.
	 * @param  {number} id Identifier of the reminder.
	 * @return {LT.Reminder|null}    The required reminder or null if it doesn't
	 *                               exist.
	 */
	getReminderById: function ( id ) {
		var reminder = null,				// Reminder that will be returned.
			i = 0,							// Counter
			len = this._reminders.length;	// Length of the array of reminders

		while ( !reminder && i < len ) {
			if ( this._reminders[ i ]._id == id ) {
				reminder = this._reminders[ i ];
			}

			i++;
		}

		return reminder;
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