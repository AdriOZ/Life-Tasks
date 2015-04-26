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
	this._counter = null;		// Interval of seconds when the alarm will be activated.
};

// methods and other properties
LT.Reminder.prototype = {
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

	/**
	 * Returns the year of the datetime.
	 * @return {number} Year of the datetime.
	 */
	getYear: function () {
		return this.getDatetime().year;
	},

	/**
	 * Returns the month of the datetime.
	 * @return {number} Month of the datetime.
	 */
	getMonth: function () {
		return this.getDatetime().month;
	},

	/**
	 * Returns the day of the datetime.
	 * @return {number} Day of the datetime.
	 */
	getDay: function () {
		return this.getDatetime().day;
	},

	/**
	 * Returns the hour of the datetime.
	 * @return {number} hour of the datetime.
	 */
	getHour: function () {
		return this.getDatetime().hour;
	},

	/**
	 * Returns the minute of the datetime.
	 * @return {number} Minute of the datetime.
	 */
	getMinute: function () {
		return this.getDatetime().minute;
	},

	/**
	 * Returns the seconds of the datetime.
	 * @return {number} Seconds of the datetime.
	 */
	getSeconds: function () {
		return this.getDatetime().second;
	},

	/**
	 * Returns the seconds remaining to be sent.
	 * @return {number} Seconds remaining.
	 */
	getSecondsToBeSended: function () {
		var datetimeObject,		// Datetime of the reminder.
			date,				// Date object with the datetime of the reminder.
			now;				// Date object.
		datetimeObject = this.getDatetime();
		now = new Date();
		date = new Date(
			datetimeObject.year,
			datetimeObject.month,
			datetimeObject.day,
			datetimeObject.hour,
			datetimeObject.minute,
			datetimeObject.second
		);

		return ( date.getTime() - now.getTime() ) * 1000;	// Milliseconds.
	},

	/**
	 * Activates the counter to sets the reminder status from not sended
	 * to sended.
	 */
	activateCounter: function () {
		if ( !this._sended ) {
			var self = this;	// Avoid scope errors

			// Setting the counter.
			this._counter = setTimeout(
				function () {
					clearTimeout( self._counter );	// Deleting counter.
					self._sended = true;			// The reminder is sended.
				},
				this.getSecondsToBeSended()
			);
		}
	},

	/**
	 * Deletes the counter.
	 */
	deleteCounter: function () {
		if ( this._counter ) {
			clearTimeout( this._counter );
		}
	}
}; 
}) ( window );