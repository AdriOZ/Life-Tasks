(function ( global ) {
global.LT = global.LT || {};	// Namespace.

/**
 * Class document.
 * @param {number} id   Identifier of the document.
 * @param {string} name Original name of the document.
 * @param {string} url  Path to the document.
 */
LT.Document = function ( id, name, url ) {
	this._id = id;		// Document identifier
	this._name = name;	// Original name of the document
	this._url = url;	// Path to the document
};

// Methods and other properties
LT.Document.prototype = {
	/**
	 * Type image.
	 * @type {Number}
	 * @const
	 */
	IMAGE: 0,

	/**
	 * Type document.
	 * @type {Number}
	 * @const
	 */
	DOCUMENT: 1,

	/**
	 * Returns the extension of the document.
	 * @return {string} Extension of the document.
	 */
	getExtension: function () {
		var extension = this._name.split( '.' );
		return extension[ extension.length -1 ];
	},

	/**
	 * Returns the type of the document with a constant.
	 * @return {number} Images: 0, Documents: 1.
	 */
	getTypeNumber: function () {
		var extension = this.getExtension().toLowerCase();
		return extension == 'jpg'
				|| extension == 'jpeg'
				|| extension == 'gif'
				|| extension == 'png'
				? this.IMAGE
				: this.DOCUMENT;
	},

	/**
	 * Returns a string with information about the type of document.
	 * @return {string} A string with information of the document.
	 */
	getTypeString: function () {
		return this.getTypeNumber() == this.IMAGE
				? 'image'
				: 'document';
	},

    clone: function () {
        return new LT.Document( this._id, this._name, this._url );
    },

	/**
	 * Returns a string in JSON format with information of the document.
	 * @return {string} String with information of the document.
	 */
	toString: function () {
		return JSON.stringify(
			{
				id: this._id,
				name: this._name,
				url: this._url,
				type: this.getTypeString()
			}
		);
	},

	/**
	 * Returns a JSON string with the basic information of the document.
	 * @return {string} String in JSON format.
	 */
	toJSON: function () {
		return JSON.stringify(
			{
				id: this._id,
				name: this._name,
				url: this._url
			}
		);
	}
};
}) ( window );