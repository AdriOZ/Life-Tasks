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

					// Reload the number of notes in the trash
					$( '#lttrash span' ).text(
						LT.Storage.numberOfDeletedNotes()
					);
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
                            LT.HTML.loadNotesContainer( tmpNotebook );

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
	},

	/**
	 * Show the modal dialogue to create a new note.
	 * @param  {number} id_notebook Identifier of the notebook
	 */
	createNote: function ( id_notebook ) {
        $( '#createNote').modal( 'show' );
        $( '#createNote button.btn-success').click(
            function () {
                var tmpNotebook = LT.Storage.getNotebookById( id_notebook );
                var creator = new LT.NoteCreator();

                // Setting the params
                creator.addNotebook( id_notebook );
                creator.addTitle( $( '#createNote input' )[ 0 ].value );
                creator.addContent( $( '#createNote textarea' )[ 0].value );

                // Add reminders
                $( '#remindersContainer input').each(
                    function ( index, value ) {
                        if ( value.value ) {
                            creator.addReminder( value.value );
                        }
                    }
                );

                // Add documents
                var documents = $( '#createNote input' )[ 1 ].files;

                if ( documents.length ) {
                    for ( var i in documents ) {
                        creator.addDocument( documents[ i ] );
                    }
                }

                // Create the note
                creator.execute(
                    function ( note ) {
                        // Delete the event
                        $( '#createNote button.btn-success').unbind( 'click' );

                        // Add the note
                        tmpNotebook.addNote( note );

                        // Close the modal and re-load the notes
                        $( '#ltnotes').html( '' );
                        LT.HTML.loadNotes( tmpNotebook );
                        $( '#createNote').modal( 'hide' );

                        // Number of the left menu
                        $( '#ltnotebooks a.active span').text( tmpNotebook.numberOfActiveNotes() );

                        // If a document could not be created, show
                        // a modal
                        if ( documents.length !== note._documents.length ) {
                            LT.HTML.simpleModalDialogue(
                                '#simpleModal',
                                'You have reached the 10 MB of storage'
                            );
                        }
                    }
                );
            }
        );
	},

    /**
     * Deletes the note with the specific id.
     * @param {number} id_note Identifier of the note.
     */
    deleteNote: function ( id_note ) {
        var tmpNote,                    // Note that will be deleted
            tmpNotebook,                // Notebok that contains the note
            formData = new FormData();  // Data that will be sent to the server

        // Get the note
        LT.Storage.forEachNotebook(function (notebook) {
            var tmp = notebook.getNoteById( id_note );
            if ( tmp ) {
                tmpNote = tmp;
                tmpNotebook = notebook;
                formData.append( 'where[id_note]', tmpNote._id );
                formData.append( 'where[id_notebook]', tmpNotebook._id );
            }
        });

        // If the note has note been deleted, deletes it
        // if not, a modal is displayed
        if ( tmpNote._active ) {
            // Making the request
            LT.RequestMaker.del.note(
                formData,
                function ( data ) {
                    tmpNote._active = false;
                    // Reload everything
                    $( 'a[onclick="LT.EventListener.loadNotebook( this, ' +
                        tmpNotebook._id + ' ); return false;"] span.badge')
                            .text( tmpNotebook.numberOfActiveNotes() );
                    $( '#lttrash span.badge')
                        .text( LT.Storage.numberOfDeletedNotes() );

                    // Reload the container
                    LT.HTML.loadNotesContainer( tmpNotebook );
                }
            );
        } else {
            // Display the modal
            $( '#areYouSure').modal( 'show' );

            // Event
            $( '#areYouSure button.btn-danger').unbind( 'click' );
            $( '#areYouSure button.btn-danger').click(function () {
                // Making the request
                LT.RequestMaker.del.note(
                    formData,
                    function ( data ) {
                        tmpNotebook.unsetNoteById( id_note );
                        $( '#lttrash span.badge')
                            .text( LT.Storage.numberOfDeletedNotes() );
                        // Reload the container
                        LT.HTML.loadDeletedNotes();
                        $( '#areYouSure').modal( 'hide' );
                    }
                );
            });
        }
    },

    /**
     * Retores the note that has been deleted.
     * @param id_note Identifier of the note.
     */
    restoreNote: function ( id_note ) {
        var tmpNote,                    // Note that will be deleted
            tmpNotebook,                // Notebok that contains the note
            formData = new FormData();  // Data that will be sent to the server

        // Get the note
        LT.Storage.forEachNotebook(function (notebook) {
            var tmp = notebook.getNoteById( id_note );
            if ( tmp ) {
                tmpNote = tmp;
                tmpNotebook = notebook;
                formData.append( 'where[id_note]', tmpNote._id );
                formData.append( 'where[id_notebook]', tmpNotebook._id );
                formData.append( 'where[active]', 1 );
            }
        });

        // Making the request
        LT.RequestMaker.update.note(
            formData,
            function ( data ) {
                tmpNote._active = 1;
                // Reload everything
                $( 'a[onclick="LT.EventListener.loadNotebook( this, ' +
                tmpNotebook._id + ' ); return false;"] span.badge')
                    .text( tmpNotebook.numberOfActiveNotes() );
                $( '#lttrash span.badge')
                    .text( LT.Storage.numberOfDeletedNotes() );
                LT.HTML.loadDeletedNotes();
            }
        );
    },

    modifyNote: function ( id_note ) {
        var notebookAndNote = LT.Storage.getNotebookAndNote( id_note );

        // First position: notebook
        // Second position: note
        var updater = new LT.NoteUpdater();

        // Set params
        updater.setNotebook( notebookAndNote[ 0]._id );
        updater.setNote( notebookAndNote[ 1 ] );

        // Fill the modal with the data
        $( '#updateNote input' )[ 0 ].value = notebookAndNote[ 1 ]._title;
        $( '#updateNote textarea' )[ 0 ].value = notebookAndNote[ 1 ]._content;

        // Set the reminders
        $( '#updateReminders').html( '' );
        notebookAndNote[ 1 ].forEachReminder(
            function ( reminder ) {
                $( '#updateReminders').append( '<div class="form-group"><div class="input-group date"><input type="text" class="form-control"/><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div></div>' );
                $( '#updateReminders .date' ).datetimepicker(
                    {
                        locale: 'en',
                        format: 'YYYY-MM-DD HH:mm:ss',
                        minDate: new Date(),
                        defaultDate: new Date(
                            reminder.getYear(),
                            reminder.getMonth(),
                            reminder.getDay(),
                            reminder.getHours(),
                            reminder.getMinutes(),
                            reminder.getSeconds()
                        )
                    }
                );
            }
        );

        // Set the documents
        $( '#updateDocuments').html( '' );
        notebookAndNote[ 1 ].forEachDocument(
            function ( doc ) {
                $( '#updateDocuments').append( '<div id="d_'+doc._id+'"><span>'+doc._name+'</span><button class="btn btn-danger btn-xs" onclick="$(this).parent().remove()">x</button></div>' );
            }
        );

        // Click the modify button
        $( '#updateNote button.btn-success').click(function () {
            // Add reminders
            $( '#updateReminders input').each(
                function ( index, value ) {
                    if ( value.value ) {
                        updater.createReminders( value.value );
                    }
                }
            );

            // Add documents
            var documents = $( '#updateNote input' )[ 1 ].files;

            if ( documents.length ) {
                for ( var i in documents ) {
                    updater.createDocument( documents[ i ] );
                }
            }

            // Deleted documents
            var notDeletedDocuments = [];

            $( '#updateDocuments span').each(
                function ( index, el ) {
                    notDeletedDocuments.push( $( el ).text() );
                }
            );

            if ( notDeletedDocuments.length ) {
                notebookAndNote[ 1 ].forEachDocument(
                    function ( doc ) {
                        if ( notDeletedDocuments
                                .indexOf( doc._name ) === -1 ) {
                            updater.deleteDocument( doc._id );
                        }
                    }
                );
            } else {
                notebookAndNote[ 1].forEachDocument(
                    function ( doc ) {
                        updater.deleteDocument( doc._id );
                    }
                );
            }
            // Title and content
            var ntitle = $( '#updateNote input')[ 0 ].value;
            var ncontent = $( '#updateNote textarea')[ 0 ].value;

            if ( ntitle !== '' ) {
                notebookAndNote[ 1 ]._title = ntitle;
            }

            if ( ncontent !== '' ) {
                notebookAndNote[ 1 ]._content = ncontent;
            }

            // Update data
            updater.execute(
                function () {
                    // Delete the event listener
                    $( '#updateNote button.btn-success').unbind( 'click' );

                    // Re-load notes
                    $( '#ltnotes').html( '' );
                    LT.HTML.loadNotes( notebookAndNote[ 0 ] );

                    // Hide modal
                    $( '#updateNote').modal( 'hide' );
                }
            );
        });

        // Show the modal
        $( '#updateNote').modal( 'show' );
    }
};
})( window, $ );