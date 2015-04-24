(function ( global ) {
global.LT = global.LT || {};	// Namespace.

/**
 * Class reminder.
 * @param {number} id       Reminder identifier.
 * @param {string} datetime Datetime when it will be sended.
 * @param {boolean} sended  Indicates if it is already sended.
 */
LT.Reminder = function ( id, datetime, sended ) {
	this._id = id;				// Reminder identificator
	this._datetime = datetime;	// Datetime when it will be sended
	this._sended = sended;		// Indicates if it is already sended
};
}) ( window );