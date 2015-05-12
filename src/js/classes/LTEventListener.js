(function ( global, $ ) {
global.LT = global.LT || {};	// Namespace

/**
 * Contains the functions that controls the events in the DOM.
 * @type {Object}
 */
LT.EventListener = {
	/**
	 * Makes the sign in request with data from the form.
	 */
	signIn: function () {
		var element = $( 'form' )[ 0 ];
		var inputs = $( element ).find( 'input' );

		if ( inputs[ 0 ].value && inputs[ 1 ].value ) {
			/* Temporal user to keep the data safe */
			var tmpUser = new LT.User( -1, '', '' );
			tmpUser._email = inputs.first().val();
			tmpUser.setPassword( inputs.last().val() );

			/* Replacing password to md5 cyphered password */
			$( element ).find( 'input' ).last().val( tmpUser._password );

			/* Making the request */
			LT.RequestMaker.makeLogin(
				new FormData( element ),
				function ( data ) {
					if ( data.status == LT.Communicator.SUCCESS ) {
						// Loading credentials
						LT.Storage._email = tmpUser._email;
						LT.Storage._password = tmpUser._password;
						LT.Storage._id = data.uid;
						LT.Storage._notebooks = [];
						LT.Storage.loadEverything();
						
						// Loading view
						LT.HTML.loadLogin();
					} else {
						LT.HTML.simpleModalDialogue(
							$( '#sign_up_in' ),
							'Incorrect email or password'
						);
						$( element ).find( 'input' ).last().val( '' );
					}
				}
			);
		}
		return false;
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