(function ( global ) {
global.LT = global.LT || {};	// Namespace.

/**
 * Class document.
 * @param {number} id   Identifier of the document.
 * @param {string} name Original name of the document.
 * @param {string} url  Path to the document.
 */
LT.Document = function ( id, name, url ) {
	this._id = id;		// Document identifier.
	this._name = name;	// Original name of the document.
	this._url = url;	// Path to the document.
};

}) ( window );