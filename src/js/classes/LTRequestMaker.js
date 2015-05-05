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
		/* TODO */
	},
	
	/**
	 * Contains the functions to make update requests.
	 * @type {Object}
	 */
	update: {
		/* TODO */
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