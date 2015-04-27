(function ( global ) {
global.LT = global.LT || {};	// Namespace.

/**
 * Notebook class.
 * @param {number} id   Identifier of the notebook.
 * @param {string} name Name of the notebook.
 */
LT.Notebook = function ( id, name ) {
	this._id = id;		// Identifier
	this._name = name;	// Name of the notebook
};
}) ( window );