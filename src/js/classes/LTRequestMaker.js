(function ( global ) {
global.LT = global.LT || {};	// Namespace

/**
 * Request Maker has functions to connect to the server
 */
LT.RequestMaker = {
	/**
	 * Makes the login request, sending the data and executing
	 * the callback when finished.
 	 * @param {FormData} data	  Form data that will be sent.
 	 * @param {Function} callback Function that will be executed.
	 */
	makeLogin: function ( data, callback ) {
		var send = LT.Communicator();
		send.setUsers();
		send.setLogin();
		send.setCallback( callback );
		send.setData( data );
		send.send();
	},
	
	/**
	 * Makes the logout request.
	 * @param  {Function} callback Function that will be executed.
	 */
	makeLogout: function ( callback ) {
		var send = LT.Communicator();
		send.setLogout();
		send.setUsers();
		send.setCallback( callback );
		send.send();
	},
	
	/**
	 * Conains the functions to make insert requests.
	 * @type {Object}
	 */
	insert: {
		/**
		 * Inserts a new user into the database.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		user: function ( data, callback ) {
			var send = LT.Communicator();
			send.setUsers();
			send.setInsert();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		},

		/**
		 * Inserts a new notebook into the database.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		notebook: function ( data, callback ) {
			var send = LT.Communicator();
			send.setNotebooks();
			send.setInsert();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		},

		/**
		 * Inserts a new note into the database.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		note: function ( data, callback ) {
			var send = LT.Communicator();
			send.setNotes();
			send.setInsert();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		},

		/**
		 * Inserts a new document into the database.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		document: function ( data, callback ) {
			var send = LT.Communicator();
			send.setDocuments();
			send.setInsert();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		},

		/**
		 * Inserts a new reminder into the database.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		reminder: function ( data, callback ) {
			var send = LT.Communicator();
			send.setReminders();
			send.setInsert();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		}
	},
	
	/**
	 * Contains the functions to make query requests.
	 * @type {Object}
	 */
	query: {
		/**
		 * Search notebooks.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		notebook: function ( data, callback ) {
			var send = LT.Communicator();
			send.setNotebooks();
			send.setQuery();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		},

		/**
		 * Search notes.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		note: function ( data, callback ) {
			var send = LT.Communicator();
			send.setNotes();
			send.setQuery();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		},

		/**
		 * Search documents.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		document: function ( data, callback ) {
			var send = LT.Communicator();
			send.setDocuments();
			send.setQuery();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		},

		/**
		 * Search reminders.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		reminder: function ( data, callback ) {
			var send = LT.Communicator();
			send.setReminders();
			send.setQuery();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		}
	},
	
	/**
	 * Contains the functions to make update requests.
	 * @type {Object}
	 */
	update: {
		/**
		 * Updates the user credentials.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		user: function ( data, callback ) {
			var send = LT.Communicator();
			send.setUsers();
			send.setUpdate();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		},

		/**
		 * Updates the name of a notebook.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		notebook: function ( data, callback ) {
			var send = LT.Communicator();
			send.setNotebooks();
			send.setUpdate();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		},

		/**
		 * Updates a note.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		note: function ( data, callback ) {
			var send = LT.Communicator();
			send.setNotes();
			send.setUpdate();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		},

		/**
		 * Updates a reminder.
		 * @param  {FormData}   data   Data to send to the server.
		 * @param  {Function} callback Function that will be executed.
		 */
		reminder: function ( data, callback ) {
			var send = LT.Communicator();
			send.setReminders();
			send.setUpdate();
			send.setCallback( callback );
			send.setData( data );
			send.send();
		}
	},
	
	/**
	 * Contains the functions to make delete requests.
	 * @type {Object}
	 */
	delete: {
		/* TODO */
	}
};

})( window );