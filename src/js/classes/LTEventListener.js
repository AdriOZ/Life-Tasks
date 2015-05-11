(function ( global, $ ) {
global.LT = global.LT || {};	// Namespace

/**
 * Contains the functions that controls the events in the DOM.
 * @type {Object}
 */
LT.EventListener = {
	/**
	 * Makes the sign in request with data from the form.
	 * @param  {object} element HTML form.
	 */
	signIn: function ( element ) {
		var inputs = $( element ).find( 'input' );

		/* Temporal user to keep the data safe */
		var tmpUser = new LT.User( -1, '', '' );
		tmpUser._email = inputs.first().val();
		tmpUser.setPassword( inputs.last().val() );

		/* Replacing password to md5 cyphered password */
		$( element ).find( 'input' ).last().val( tmpUser._password );

		/* Making the request */
		LT.RequestMaker.makeLogin(
			element,
			function ( data ) {
				// TODO
			}
		);
	},

	/**
	 * Makes the sign up request with the data from the form.
	 * @param  {object} element HTML form.
	 */
	signUp: function ( element ) {
		/* TODO */
	}
};
})( window, $ );