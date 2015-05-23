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
					// Deleting content of the input password
					$( element ).find( 'input' ).last().val( '' );

					if ( data.status == LT.Communicator.SUCCESS ) {
						// Loading credentials
						LT.Storage._email = tmpUser._email;
						LT.Storage._password = tmpUser._password;
						LT.Storage._id = data.uid;
						LT.Storage._notebooks = [];
						LT.Storage.loadEverything();

						// Loading view
						LT.HTML.loadProgressBar();
					} else {
						LT.HTML.simpleModalDialogue(
							$( '#sign_up_in' ),
							'Incorrect email or password'
						);
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
	signUp: function () {
		var element = $( 'form' )[ 1 ];
		var inputs = $( element ).find( 'input' );

		if ( inputs[ 0 ].value && inputs[ 1 ].value ) {
			/* Temporal user to keep the data safe */
			var tmpUser = new LT.User( -1, '', '' );
			tmpUser._email = inputs.first().val();
			tmpUser.setPassword( inputs.last().val() );

			/* Replacing password to md5 cyphered password */
			$( element ).find( 'input' ).last().val( tmpUser._password );

			/* Making the request */
			LT.RequestMaker.insert.user(
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
							'Email is already taken'
						);
						$( element ).find( 'input' ).last().val( '' );
					}
				}
			);
		}
		return false;
	},

	/**
	 * Makes the sign out request.
	 */
	signOut: function () {
		// Request
		LT.RequestMaker.makeLogout(function () {
			// Reset Data
			LT.Storage._id = -1;
			LT.Storage._email = '';
			LT.Storage._password = '';
			LT.Storage._notebooks = [];

			// Load the index
			LT.HTML.loadIndex();
		});
	},

	/**
	 * Loads the notes from the notebook.
	 * @param  {HTMLElement} element Link to the notebook.
	 * @param  {number} id      Identifier of the notebook.
	 */
	loadNotebook: function ( element, id ) {
		$( '#ltnotebooks a, #lttrash a' ).removeClass( 'active' );
		$( element ).addClass( 'active' );
		LT.HTML.loadNotesContainer( LT.Storage.getNotebookById( id ) );
	},

	/**
	 * Loads the notes that are not active.
	 */
	loadDeletedNotes: function () {
		$( '#ltnotebooks a' ).removeClass( 'active' );
		$( '#lttrash a' ).addClass( 'active' );
		LT.HTML.loadDeletedNotes();
	},

	/**
	 * The modal with the content is displayed.
	 */
	loadNewNotebook: function () {
		$( '#createNotebook h4' ).removeClass( 'text-danger' );
		$( '#createNotebook' ).modal( 'show' );
	},

	/**
	 * Controls the creation of a new notebook.
	 */
	createNewNotebook: function () {
		var text = $( '#createNotebook input' )[ 0 ].value,
			formData = new FormData(),
			newNotebook;

		if ( !text ) {
			$( '#createNotebook div.form-group' ).addClass( 'has-error' );
			$( '#createNotebook h4' ).text( 'Untitled notebook' );
			$( '#createNotebook h4' ).addClass( 'text-danger' );
		} else if ( LT.Storage.notebookExists( text ) ) {
			$( '#createNotebook div.form-group' ).addClass( 'has-error' );
			$( '#createNotebook h4' ).text( 'There is already a notebook called "' +
				text + '"' );
			$( '#createNotebook h4' ).addClass( 'text-danger' );
		} else {
			formData.append( 'where[name]', text );
			LT.RequestMaker.insert.notebook(
				formData,
				function ( data ) {
					if ( data.status === LT.Communicator.ERROR ) {
						$( '#createNotebook div.form-group' )
							.addClass( 'has-error' );
						$( '#createNotebook h4' ).text( 'Too long name' );
					} else {
						// Creating the notebook
						newNotebook = new LT.Notebook( data.id_notebook, text );
						LT.Storage.addNotebook( newNotebook );

						// Re-load notebooks
						LT.HTML.loadNotebooks();

						// Close the modal and change properties
						$( '#createNotebook' ).modal( 'hide' );
						$( '#createNotebook div.form-group' )
							.removeClass( 'has-error' );
						$( '#createNotebook h4' ).text( 'New Notebook' );
						$( '#createNotebook input' )[ 0 ].value = '';
					}
				}
			);
		}
	},

	/**
	 * Deletes the notebook.
	 * @param  {integer} id_notebook Identifier of the notebook.
	 */
	deleteNotebook: function ( id_notebook ) {
		$( '#areYouSure' ).modal( 'show' );
		$( '#areYouSure button.btn-danger' ).click(function () {
			$( '#areYouSure' ).modal( 'hide' );
			var formData = new FormData();
			formData.append( 'where[id_notebook]', id_notebook );
			LT.RequestMaker.del.notebook(
				formData,
				function ( data ) {
					LT.Storage.unsetNotebookById( id_notebook );
					$( '#ltnotescontainer' ).html( '' );
					LT.HTML.loadNotebooks();
				}
			);
		});
	},

	/**
	 * Modifies de name of the notebook.
	 * @param  {integer} id_notebook Identifier of the notebook.
	 */
	modifyNotebook: function ( id_notebook ) {
		var tmpNotebook = LT.Storage.getNotebookById( id_notebook );
		$( '#modifyNotebook h4' ).text( 'Modify ' + tmpNotebook._name );
		$( '#modifyNotebook h4' ).removeClass( 'text-danger' );
		$( '#modifyNotebook input' )[ 0 ].value = tmpNotebook._name;
		$( '#modifyNotebook' ).modal( 'show' );

		// Event listener
		$( '#modifyNotebook button.btn-success' ).click(function () {
			var text = $( '#modifyNotebook input' )[ 0 ].value,
				formData;

			if ( !text ) {
				$( '#modifyNotebook div.form-group' ).addClass( 'has-error' );
				$( '#modifyNotebook h4' ).text( 'Untitled notebook' );
				$( '#modifyNotebook h4' ).addClass( 'text-danger' );
			} else if ( text === tmpNotebook._name ) {
				// Close the modal and change properties
				$( '#modifyNotebook' ).modal( 'hide' );
				$( '#modifyNotebook div.form-group' )
					.removeClass( 'has-error' );
				$( '#modifyNotebook h4' ).text( 'Modify' );
				$( '#modifyNotebook input' )[ 0 ].value = '';
			} else if ( LT.Storage.notebookExists( text ) ) {
				$( '#modifyNotebook div.form-group' ).addClass( 'has-error' );
				$( '#modifyNotebook h4' ).text( 'There is already a notebook called "' +
					text + '"' );
				$( '#modifyNotebook h4' ).addClass( 'text-danger' );
			} else {
				// Make the request
				formData = new FormData();
				formData.append( 'where[name]', text );
				formData.append( 'where[id_notebook]', id_notebook );
				LT.RequestMaker.update.notebook(
					formData,
					function ( data ) {
						if ( data.status === LT.Communicator.ERROR ) {
							$( '#modifyNotebook div.form-group' )
								.addClass( 'has-error' );
							$( '#modifyNotebook h4' ).text( 'Too long name' );
						} else {
							tmpNotebook._name = text;

							// Re-load notebooks
							LT.HTML.loadNotebooks();

							// Close the modal and change properties
							$( '#modifyNotebook' ).modal( 'hide' );
							$( '#modifyNotebook div.form-group' )
								.removeClass( 'has-error' );
							$( '#modifyNotebook h4' ).text( 'Modify' );
							$( '#modifyNotebook input' )[ 0 ].value = '';
						}
					}
				);
			}
		});
	},

	/**
	 * Deletes the account.
	 */
	deleteAccount: function () {
		$( '#accountSettings' ).modal( 'hide' );
		LT.RequestMaker.del.user(
			new FormData(),
			function ( data ) {
				// Reset Data
				LT.Storage._id = -1;
				LT.Storage._email = '';
				LT.Storage._password = '';
				LT.Storage._notebooks = [];

				// Load the index
				LT.HTML.loadIndex();
			}
		);
	},

	/**
	 * Modifies the account settings.
	 */
	modifyAccount: function () {
		var email = $( '#accountSettings input' )[ 0 ].value,
			pass = $( '#accountSettings input' )[ 1 ].value,
			tmp = {},
			formData = new FormData();
		// Errors
		if ( email && email !== LT.Storage._email ) {
			formData.append( 'where[email]', email );
			tmp[ 'where[email]' ] = email;
		} else if ( email === LT.Storage._email ) {
			$( '#accountSettings' ).modal( 'hide' );
		}

		if ( pass ) {
			pass = md5( pass );
			formData.append( 'where[pass]', pass );
			tmp[ 'where[pass]' ] = pass;
		}

		// If there is data to send
		if ( tmp[ 'where[email]' ] || tmp[ 'where[pass]' ] ) {
			LT.RequestMaker.update.user(
				formData,
				function ( data ) {
					if ( data === LT.Communicator.ERROR ) {
						$( '#accountSettings h4' )
							.text( '"' + email + '" is already taken' );
						$( '#accountSettings h4' ).addClass( 'text-danger' );
						$( '#accountSettings div.form-group' ).first()
							.addClass( 'has-error' );
					} else {
						$( '#accountSettings' ).modal( 'hide' );
						LT.Storage._email = email;
						LT.Storage._password = pass;
					}
				}
			);
		}
	}
};
})( window, $ );