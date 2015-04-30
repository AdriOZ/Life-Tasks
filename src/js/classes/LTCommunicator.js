(function ( global, $ ) {
global.LT = global.LT || {};	// Namespace

/**
 * Communicates with the server side to get, insert, update or delete
 * data.
 */
LT.Communicator = function () {
	var _table,		// Table of the database
		_action,	// Action that will be performed
		_data,		// Data to send
		_callback,	// Function to make de callback

	// Constants
	/**
	 * Path to the access of server side functions.
	 * @type {String}
	 * @const
	 */
	ACCESS = 'php/access.php',

	/**
	 * Error message in the operation.
	 * @type {Number}
	 * @const
	 */
	ERROR = 0,

	/**
	 * Success message in the operation.
	 * @type {Number}
	 * @const
	 */
	SUCCESS = 1,

	/**
	 * The user can't save more file because is not storage
	 * available.
	 * @type {Number}
	 * @const
	 */
	NO_STORAGE = 2,

	/**
	 * Login request.
	 * @type {Number}
	 * @const
	 */
	LOGIN = 0,

	/**
	 * Close session request.
	 * @type {Number}
	 * @const
	 */
	LOGOUT = 1,

	/**
	 * Check the percentage of storage the user is using.
	 * @type {Number}
	 * @const
	 */
	USED_STORAGE = 2,

	/**
	 * A request to search data.
	 * @type {Number}
	 * @const
	 */
	QUERY = 3,

	/**
	 * A request to insert data.
	 * @type {Number}
	 * @const
	 */
	INSERT = 4,

	/**
	 * A request to update data.
	 * @type {Number}
	 * @const
	 */
	UPDATE = 5,

	/**
	 * A request to delete data.
	 * @type {Number}
	 * @const
	 */
	DELETE = 6,

	/**
	 * Action that affects the table of users.
	 * @type {Number}
	 * @const
	 */
	USERS = 0,

	/**
	 * Action that affects the table of notebooks.
	 * @type {Number}
	 * @const
	 */
	NOTEBOOKS = 1,

	/**
	 * Action that affects the table of notes.
	 * @type {Number}
	 * @const
	 */
	NOTES = 2,

	/**
	 * Action that affects the table of documents.
	 * @type {Number}
	 * @const
	 */
	DOCS = 3,

	/**
	 * Action that affects the table of reminders.
	 * @type {Number}
	 */
	REMINDERS = 4;

	// Private functions
	
	// Checks if the data is correct. Throws exception if error
	function _checkData () {
		// TODO
	}

	// Checks if the action is correct for the table. Throws exception if error
	function _checkTableAction () {
		// TODO
	}

	// Checks both data and table-action. Throws exception if error
	function _check () {
		_checkData();
		_checkTableAction();
	}

	// Closures
	return {
		/**
		 * Sets the action of the request to a query type.
		 */
		setQuery: function () {
			_action = QUERY;
		},

		/**
		 * Sets the action of the request to a insert type.
		 */
		setInsert: function () {
			_action = INSERT;
		},

		/**
		 * Sets the action of the request to a update type.
		 */
		setUpdate: function () {
			_action = UPDATE;
		},

		/**
		 * Sets the action of the request to a delete type.
		 */
		setDelete: function () {
			_action = DELETE;
		},

		/**
		 * Sets the action of the request to login type.
		 */
		setLogin: function () {
			_action = LOGIN;
		},

		/**
		 * Sets the action of the request to a log out type.
		 */
		setLogout: function () {
			_action = LOGOUT;
		},

		/**
		 * Sets the action of the request to a used storage type.
		 */
		setUsedStorage: function () {
			_action = USED_STORAGE;
		},

		/**
		 * Sets the users table.
		 */
		setUsers: function () {
			_table = USERS;
		},

		/**
		 * Sets the notebooks table.
		 */
		setNotebooks: function () {
			_table = NOTEBOOKS;
		},

		/**
		 * Sets the notes table.
		 */
		setNotes: function () {
			_table = NOTES;
		},

		/**
		 * Sets the documents table.
		 */
		setDocuments: function () {
			_table = DOCS;
		},

		/**
		 * Sets the reminders table.
		 */
		setReminders: function () {
			_table = REMINDERS;
		},

		/**
		 * Sets the data to be sent.
		 * @param {FormData} data Data to be sent.
		 */
		setData: function ( data ) {
			if ( !( data instanceof FormData ) ) {
				throw 'data must be an instance of FormData';
			}
			_data = data;
		},

		/**
		 * Sets the callback that will be executed.
		 * @param {Function} callback Function that will be executed.
		 */
		setCallback: function ( callback ) {
			if ( typeof callback !== 'function' ) {
				throw 'callback must be a function';
			}
			_callback = callback;
		}
	};
};
})( window, $ );