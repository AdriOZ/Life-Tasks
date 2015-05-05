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
		
	},
	
	/**
	 * Contains the functions to make query requests.
	 * @type {Object}
	 */
	query: {
		
	},
	
	/**
	 * Contains the functions to make update requests.
	 * @type {Object}
	 */
	update: {
		
	},
	
	/**
	 * Contains the functions to make delete requests.
	 * @type {Object}
	 */
	delete: {
		
	}
};

})( window );