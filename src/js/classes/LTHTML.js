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
		index: 'index.html',
		logedNavbar: _generalPath + 'loged_navbar.html',
		logedContent: _specificPath + 'loged_content.html'
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
		 * @param  {string} title   Title of the modal dialogue.
		 * @param  {string} content Content of the modal dialogue.
		 */
		simpleModalDialogue: function ( element, title, content ) {

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
				function ( content ) {
					$( '#ltheader' ).html( content );
				}
			);

			// Load content
			$.post(
				_sections.logedContent,
				function ( content ) {
					$( '#ltheader' ).html( content );
				}
			);
		},

		/**
		 * Loads the index contents again.
		 */
		loadIndex: function () {
			$.post(
				_sections.index,
				function ( content ) {
					$( document ).html( content );
				}
			);
		}
	};
})();
})( window, $ );