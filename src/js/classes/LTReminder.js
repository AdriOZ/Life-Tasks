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
	this._alarm = null;			// Interval of seconds when the alarm will be activated.
};

// methods and other properties
LT.Reminder.prototype = {
	/**
	 * Maximum number of seconds left to activate a event listener
	 * when the datetime is reached.
	 * @type {Number}
	 * @const
	 */
	MAX_SECONDS_TO_ACTIVATE: 3600,

	/**
	 * Returns an object with the information of the datetime.
	 * @return {object} Object with the information.
	 */
	getDatetime: function () {
		// YYYY-MM-DD HH:MM:SS
		var halves = this._datetime.split( ' ' );

		// halves[ 0 ] = YYYY-MM-DD
		// halves[ 1 ] = HH:MM:SS
		var yearMonthDay = halves[ 0 ].split( '-' );
		var hourMinuteSecond = halves[ 1 ].split( ':' );

		return {
			year: yearMonthDay[ 0 ],
			month: yearMonthDay[ 1 ],
			day: yearMonthDay[ 2 ],
			hour: hourMinuteSecond[ 0 ],
			minute: hourMinuteSecond[ 1 ],
			second: hourMinuteSecond[ 2 ]
		};
	},

	getYear: function () {
		// TODO
	},

	getMonth: function () {
		// TODO
	},

	getDay: function () {
		// TODO
	},

	getHour: function () {
		// TODO
	},

	getMinute: function () {
		// TODO
	},

	getSeconds: function () {
		// TODO
	},

	getSecondsToBeSended: function () {
		// TODO
	},

	canActivateAlarm: function () {
		// TODO
	},

	setAlarm: function ( callback ) {
		// TODO
	},

	deleteAlarm: function () {
		// TODO
	}
}; 
}) ( window );