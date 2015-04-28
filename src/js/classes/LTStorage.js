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
})( window, $ );