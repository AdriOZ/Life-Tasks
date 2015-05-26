(function ( global, $ ) {
global.LT = global.LT || {};	// Namespace

/**
 * Contains functions that load the html into the page.
 * @type {Object}
 */
LT.HTML = (function () {
	// Private properties
	var _device,		// Device: desktop or mobile
		_generalPath,	// Path to pages that are common in both kind of devices
		_specificPath,	// Path to pages specific for desktop or mobiles
		_sections,		// Array of sections
		_modals;		// Array of modals dialogues

	// Initializing properties
	_device = _isMobile() ? 'mobile' : 'desktop';
	_generalPath = 'html/';
	_specificPath = _generalPath + _device + '/';
	_sections = {
		index: _generalPath + 'index.html',
		logedNavbar: _generalPath + 'loged_navbar.html',
		logedContent: _specificPath + 'loged_content.html',
		notebook: _generalPath + 'notebook.html',
		notesContainer: _generalPath + 'notes_container.html',
		note: _generalPath + 'note.html',
		deletedNotes: _generalPath + 'deleted_note.html'
	};

	// Returns true if the device is a mobile.
	function _isMobile () {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
				.test( navigator.userAgent );
	}

	// Closures
	return {
		/**
		 * Shows a simple modal dialogue with the specific title and
		 * content.
		 * @param  {object} element Element that contains the modal dialogue.
		 * @param  {string} content Content of the modal dialogue.
		 */
		simpleModalDialogue: function ( element, content ) {
			$( element ).find( '.modal-title' ).text( content );
			$( element ).modal( 'show' );
		},

		/**
		 * Loads the contents of the loged view.
		 */
		loadLogin: function () {
			// Deleting previous content
			$( '#ltpage' ).html(
				'<div id="ltheader"></div><div id="ltcontent"></div>'
			);

			// Load navbar
			$.post(
				_sections.logedNavbar,
				'',
				function ( content ) {
					$( '#ltheader' ).html( content );
				}
			);

			// Load content
			$.post(
				_sections.logedContent,
				'',
				function ( content ) {
					$( '#ltcontent' ).html( content );

					// Load notebooks
					LT.HTML.loadNotebooks();

					// Load the number of deleted notes
					$( '#lttrash span.badge' )
						.text( LT.Storage.numberOfDeletedNotes() );
				}
			);
		},

		/**
		 * Loads the index contents again.
		 */
		loadIndex: function () {
			$.post(
				_sections.index,
				'',
				function ( content ) {
					$( 'body' ).html( content );
				}
			);
		},

		/**
		 * Loads the notebooks into the container div.
		 */
		loadNotebooks: function () {
			$.post(
				_sections.notebook,
				'',
				function ( data ) {
					$( '#ltnotebooks' ).html( '' );		// Empty

					LT.Storage.forEachNotebook(function ( nt ) {
						var cpy = data;
						// Replacing content
						cpy = cpy.replace( '{{id}}', nt._id );
						cpy = cpy.replace( '{{name}}', nt._name );
						cpy = cpy.replace( '{{number}}',
							nt.numberOfActiveNotes() );
						cpy += document.getElementById( 'ltnotebooks' ).innerHTML;
						// Adding html
						document.getElementById( 'ltnotebooks' ).innerHTML = cpy;
					});

					// Only if the device is not a mobile the notebook must be
					// loaded.
					if ( _device !== 'mobile' ) {
						// Set the first notebook as selected
						$( '#ltnotebooks a' ).first().addClass( 'active' );

						// Load the contents of the notebook
						LT.HTML.loadNotesContainer(
							LT.Storage._notebooks[ LT.Storage._notebooks.length -1 ]
						);
					}
				},
				'text'
			);
		},

		/**
		 * Loads the html that will contain the notes.
		 * @param  {LT.Notebook} nt Notebook.
		 */
		loadNotesContainer: function ( nt ) {
			if ( nt ) {
				$.post(
					_sections.notesContainer,
					'',
					function ( data ) {
						data = data.replace( '{{name}}', nt._name );
						data = data.replace( /_theID/g, nt._id );
						$( '#ltnotescontainer' ).html( data );
						LT.HTML.loadNotes( nt );

						// Show navbar in mobile
						if ( _device === 'mobile' ) {
							$( 'nav.navbar-fixed-bottom' ).removeClass( 'hide' );
						}
					},
					'text'
				);
			}
		},

		/**
		 * Loads the notes of the notebook.
		 * @param  {LT.Notebook} nt Noebook.
		 */
		loadNotes: function ( nt ) {
			$.post(
				_sections.note,
				'',
				function ( data ) {
					nt.forEachNote(function ( note ) {
						if ( note._active ) {
							var cpy = data;
							cpy = cpy.replace( /_theId/g, note._id );
							cpy = cpy.replace( '{{title}}', note._title );
							cpy = cpy.replace( '{{content}}', note._content );
							cpy = cpy.replace( '{{documents}}',
								note.documentsToHTML() );
							cpy = cpy.replace( '{{reminders}}',
								note.remindersToHTML() );
							cpy += document.getElementById( 'ltnotes' )
								.innerHTML;
							document.getElementById( 'ltnotes' )
								.innerHTML = cpy;
						}
					});
				},
				'text'
			);
		},

		/**
		 * Load the notes that are not active.
		 */
		loadDeletedNotes: function () {
			// Load the notes
			$.post(
				_sections.notesContainer,
				'',
				function ( data ) {
					data = data.replace( '{{name}}', 'Trash' );
					$( '#ltnotescontainer' ).html( data );
					$( '#ltnotescontainer > div' ).last().remove();

					// Load the notes
					$.post(
						_sections.deletedNotes,
						'',
						function ( data ) {
							var cpy;	// Copy of the data
							var deletedNotes = LT.Storage.getDeletedNotes();
							for ( var i in deletedNotes ) {
								cpy = data;
								cpy = cpy.replace( /_theId/g,
									deletedNotes[ i ]._id );
								cpy = cpy.replace( '{{title}}',
									deletedNotes[ i ]._title );
								cpy = cpy.replace( '{{content}}',
									deletedNotes[ i ]._content );
								cpy = cpy.replace( '{{documents}}',
									deletedNotes[ i ].documentsToHTML() );
								cpy = cpy.replace( '{{reminders}}',
									deletedNotes[ i ].remindersToHTML() );
								cpy += document.getElementById( 'ltnotes' )
									.innerHTML;
								document.getElementById( 'ltnotes' )
									.innerHTML = cpy;
							}
						},
						'text'
					);
				},
				'text'
			);
			// Show navbar in mobile
			if ( _device === 'mobile' ) {
				$( 'nav.navbar-fixed-bottom' ).removeClass( 'hide' );
			}
		},

		/**
		 * Display a progress bar while the content is loaded.
		 */
		loadProgressBar: function () {
			var counter = 0,	// Counts the time
				interval;		// Save the interval
			$( '#progressbar' ).modal( 'show' );

			interval = global.setInterval(function () {
				if ( counter < 100 ) {
					counter += 5;
					$( '#progressbar div.progress-bar' ).width( counter + '%' );
				} else {
					global.clearInterval( interval );
					$( '#progressbar' ).modal( 'hide' );
					LT.HTML.loadLogin();
				}
			},100);	// 2 seconds
		}
	};
})();
})( window, $ );