(function ( global, $ ) {
global.LT = global.LT || {};	// Namespace

/* Object */
LT.Storage = new LT.User( -1, '', '' );		// Default user account

LT.Storage.loadEverything = function () {
	LT.RequestMaker.query.notebook( new FormData(), loadNotebooks );
	var chargedNotebooks = false;	// Times that the loadNotebooks function has been called.

	function loadNotebooks ( data ) {
		var tmpNotebook;

		for ( var i in data.notebooks ) {
			tmpNotebook = new LT.Notebook(
				data.notebooks[ i ].id_notebook,
				data.notebooks[ i ].name
			);
			LT.Storage.addNotebook( tmpNotebook );
			loadNotes( tmpNotebook );
		}
	}

	function loadNotes ( notebook ) {
		var tmpRequest = new FormData();
		tmpRequest.append( 'where[id_notebook]', notebook._id );
		LT.RequestMaker.query.note(
			tmpRequest,
			function ( data ) {
				var tmpNote;

				for ( var i in data.notes ) {
					tmpNote = new LT.Note(
						data.notes[ i ].id_note,
						data.notes[ i ].title,
						data.notes[ i ].content,
						data.notes[ i ].active
					);
					notebook.addNote( tmpNote );
					loadDocuments( tmpNote );
					loadReminders( tmpNote );
				}
			}
		);
	}

	function loadDocuments ( note ) {
		var tmpRequest = new FormData();
		tmpRequest.append( 'where[id_note]', note._id );
		LT.RequestMaker.query.document(
			tmpRequest,
			function ( data ) {
				var tmpDocument;

				for ( var i in data.documents ) {
					tmpDocument = new LT.Document(
						data.documents[ i ].id_document,
						data.documents[ i ].name,
						data.documents[ i ].url
					);
					note.addDocument( tmpDocument );
				}
			}
		);
	}

	function loadReminders ( note ) {
		var tmpRequest = new FormData();
		tmpRequest.append( 'where[id_note]', note._id );
		LT.RequestMaker.query.reminder(
			tmpRequest,
			function ( data ) {
				var tmpReminder;

				for ( var i in data.reminders ) {
					tmpReminder = new LT.Reminder(
						data.reminders[ i ].id_reminder,
						data.reminders[ i ].d_reminder,
						data.reminders[ i ].sent
					);
					tmpReminder.activateCounter();
					note.addReminder( tmpReminder );
				}
			}
		);
	}
};

var NO_STORAGE = 0,			// Cookies disabled and no localStorage.
	COOKIE_STORAGE = 1,		// Must use cookies because localStorage isn't supported.
	WEB_STORAGE = 2;		// localStorage supported.

var typeOfStorage = getTypeOfStorage(); // The used type storage.

/**
 * Get the type of used storage.
 * @return {number} NO_STORAGE, COOKIE_STORAGE or WEB_STORAGE.
 */
function getTypeOfStorage () {
	var typeOfStorage;

	try {
		localStorage.setItem( 'test', 'test' );
		localStorage.removeItem( 'test' );
		typeOfStorage = WEB_STORAGE;
	} catch ( e ) {
		if ( navigator.cookieEnabled ) {
			typeOfStorage = COOKIE_STORAGE;
		} else {
			typeOfStorage = NO_STORAGE;
		}
	}

	return typeOfStorage;
}

/**
 * Import data from the storage
 */
function importData () {
	var aux;	// Parsed object

	if ( typeOfStorage === WEB_STORAGE ) {
		// Checks if there is data
		if ( localStorage.getItem( 'storage' ) ) {
			aux = JSON.parse( localStorage.getItem( 'storage' ) );

			// Importing data
			LT.Storage._id = aux.id;
			LT.Storage._email = aux.email;
			LT.Storage._password = aux.password;
		}
	} else if ( typeOfStorage === COOKIE_STORAGE ) {
		// With cookies, only store the id, email and password.
		if ( $.cookie( 'id' )
			&& $.cookie( 'email' )
			&& $.cookie( 'password' ) ) {
			LT.Storage._id = $.cookie( 'id' );
			LT.Storage._email = $.cookie( 'email' );
			LT.Storage._password = $.cookie( 'password' );
		}
	}
}

/**
 * Exports all data into the storage used.
 */
function exportData () {
	var COOKIES_LIFE = 30;	// Days to live.
	if ( typeOfStorage === WEB_STORAGE ) {
		localStorage.setItem( 'storage', LT.Storage.toJSON() );
	} else if ( typeOfStorage === COOKIE_STORAGE ) {
		$.cookie( 'id', LT.Storage._id, { expires: COOKIES_LIFE } );
		$.cookie( 'email', LT.Storage._email, { expires: COOKIES_LIFE } );
		$.cookie( 'password', LT.Storage._password, { expires: COOKIES_LIFE } );
	}
}

/* Adding events only if the storage is enabled */
if ( typeOfStorage !== NO_STORAGE ) {
	// Import
	global.addEventListener( 'load', function () {
		importData();		// Set the data
		
		// Make a login request and get extra data
		if ( LT.Storage._id !== -1 ) {
			var tmp = new FormData();
			tmp.append( 'where[email]', LT.Storage._email );
			tmp.append( 'where[pass]', LT.Storage._password );
			LT.RequestMaker.makeLogin( tmp, LT.Storage.loadEverything );
			LT.HTML.loadProgressBar();
		}
	});

	// Export
	global.addEventListener( 'beforeunload', exportData );
}
})( window, $ );