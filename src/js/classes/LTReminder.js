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

	getSecondsToBeSended: function () {
		// TODO
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
	},

	// Private methods
	
	/**
	 * Converts the years into seconds.
	 * @param  {number} years Number of years to be converted.
	 * @return {number}       Equivalent number of seconds.
	 */
	_yearsToSeconds: function ( years ) {
		return years * 365 * 24 * 60 * 60;
	},

	/**
	 * Converts the months into seconds.
	 * @param  {number} months Number of months to be converted.
	 * @return {number}       Equivalent number of seconds.
	 */
	_monthsToSeconds: function ( months ) {
		return months * 30 * 24 * 60 * 60;
	},

	/**
	 * Converts the days into seconds.
	 * @param  {number} days Number of days to be converted.
	 * @return {number}       Equivalent number of seconds.
	 */
	_daysToSeconds: function ( days ) {
		return days * 24 * 60 * 60;
	},

	/**
	 * Converts the hours into seconds.
	 * @param  {number} hours Number of hours to be converted.
	 * @return {number}       Equivalent number of seconds.
	 */
	_hoursToSeconds: function ( hours ) {
		return hours * 60 * 60;
	},

	/**
	 * Converts the minutes into seconds.
	 * @param  {number} years Number of minutes to be converted.
	 * @return {number}       Equivalent number of seconds.
	 */
	_minutesToSeconds: function ( minutes ) {
		return minutes * 60;
	},

	/**
	 * Converts a datetime in seconds.
	 * @param  {number} years   Year of the datetime.
	 * @param  {number} months  Month of the datetime.
	 * @param  {number} days    Days of the datetime.
	 * @param  {number} hours   Hour of the datetime.
	 * @param  {number} minutes Minutes of the datetime.
	 * @param  {number} seconds Seconds of the datetime.
	 * @return {number}         Number of seconds.
	 */
	_datetimeToSeconds: function ( years, months, days, hours, minutes, seconds ) {
		return this._yearsToSeconds( years )
				+ this._monthsToSeconds( months )
				+ this._daysToSeconds( days )
				+ this._hoursToSeconds( hours )
				+ this._minutesToSeconds( minutes )
				+ parseInt( seconds );
	}
}; 
}) ( window );