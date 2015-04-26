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
	addDocument: function ( document ) {
		// TODO
	},

	addReminder: function ( reminder ) {
		// TODO
	},

	getDocumentById: function ( id ) {
		// TODO
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