(function ( global, $ ) {
global.LT = global.LT || {};	// Namespace

/* Object */
LT.Storage = new LT.User( -1, '', '' );		// Default user account

/* util */
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
 * Exports all data into the storage used.
 */
function exportData () {
	var COOKIES_LIFE = 30;	// Days to live.
	if ( typeOfStorage === WEB_STORAGE ) {
		localStorage.setItem( 'storage', JSON.stringify( LT.Storage ) );
	} else if ( typeOfStorage === COOKIE_STORAGE ) {
		$.cookie( 'id', LT.Storage._id, { expires: COOKIES_LIFE } );
		$.cookie( 'email', LT.Storage._email, { expires: COOKIES_LIFE } );
		$.cookie( 'password', LT.Storage._password, { expires: COOKIES_LIFE } );
	}
}

/**
 * Import the storaged data into the LT.Storage variable.
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
			LT.Storage.importNotebooks( aux.notebooks );
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

/* Adding events only if the storage is enabled */
if ( typeOfStorage !== NO_STORAGE ) {
	global.addEventListener( 'load', importData );
	global.addEventListener( 'beforeunload', exportData );
}
})( window, $ );