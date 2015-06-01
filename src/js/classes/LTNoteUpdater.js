/**
 * Updates the information of a note.
 * @constructor
 */
LT.NoteUpdater = function () {
    this._note = null;          // Note that will be updated
    this._notebook = -1;        // Id of the notebook
    this._deleteDocuments = []; // Documents that will be deleted
    this._createDocuments = []; // Documents that will be updated
    this._createReminders = []; // Reminders that will be created
};

// Methods
LT.NoteUpdater.prototype = {
    setNotebook: function ( id_notebook ) {
        this._notebook = id_notebook;
    },

    setNote: function ( note ) {
        this._note = note;
    },

    deleteDocument: function ( id_document ) {
        this._deleteDocuments.push( id_document );
    },

    createDocument: function ( document ) {
        this._createDocuments.push( document );
    },

    createReminders: function ( reminder ) {
        this._createReminders.push( reminder );
    },

    execute: function ( callback ) {
        // 1- Change title and content
        // 2- Delete reminders
        // 3- Insert reminders
        // 4- Delete documents
        // 5- Insert documents
        // 6- Execute callback
        this._updateNote( callback );
    },

    _updateNote: function ( callback ) {
        var formData = new FormData();  // Data to send
        var self = this;                // Avoid scope errors

        // Request
        formData.append( 'where[id_notebook]', this._notebook );
        formData.append( 'where[id_note]', this._note._id );
        formData.append( 'where[title]', this._note._title );
        formData.append( 'where[content]', this._note._content );

        LT.RequestMaker.update.note(
            formData,
            function ( data ) {
                self._deleteReminder( 0, callback );
            }
        );
    },

    _deleteReminder: function ( index, callback ) {
        if ( index < this._note._reminders.length ) {
            var formData = new FormData();  // Data to send
            var self = this;                // Avoid scope errors

            // Request
            formData.append( 'where[id_reminder]',
                this._note._reminders[ index]._id );

            LT.RequestMaker.del.reminder(
                formData,
                function ( data ) {
                    self._deleteReminder( index + 1, callback );
                }
            );
        } else {
            // Reset reminders and re-insert them
            this._note._reminders = [];
            this._insertReminder( 0, callback );
        }
    },

    _insertReminder: function ( index, callback ) {
        if ( index < this._createReminders.length ) {
            var reminder = new LT.Reminder(
                -1,                                      // Temporal id
                this._createReminders[ index ],          // Datetime string
                false                                    // Not sent
            );
            var formData = new FormData();               // Data to send
            var datetimeObject = reminder.getDatetime(); // Object with the data
            var self = this;                             // Avoid scope errors.

            // Make the request
            formData.append( 'where[id_note]', this._note._id );
            formData.append( 'where[year]', datetimeObject.year );
            formData.append( 'where[month]', datetimeObject.month );
            formData.append( 'where[day]', datetimeObject.day );
            formData.append( 'where[hour]', datetimeObject.hours );
            formData.append( 'where[minute]', datetimeObject.minutes );
            formData.append( 'where[second]', datetimeObject.seconds );

            LT.RequestMaker.insert.reminder(
                formData,
                function ( data ) {
                    reminder._id = data.id_reminder;
                    self._note.addReminder( reminder );
                    // Call the function with the next index
                    self._insertReminder( index + 1, callback );
                }
            );
        } else {
            this._removeDocument( 0, callback );
        }
    },

    _removeDocument: function ( index, callback ) {
        if ( index < this._deleteDocuments.length ) {
            var formData = new FormData();  // Data to send
            var self = this;                // Avoid scope errors

            // Request
            formData.append( 'where[id_document]',
                this._deleteDocuments[ index ] );
            formData.append( 'where[id_note]', this._note._id );

            LT.RequestMaker.del.document(
                formData,
                function ( data ) {
                    self._note.unsetDocumentById(
                        self._deleteDocuments[ index ]
                    );
                    // Next document
                    self._removeDocument( index + 1, callback );
                }
            );
        } else {
            this._insertDocument( 0, callback );
        }
    },

    _insertDocument: function ( index, callback ) {
        if ( index < this._createDocuments.length ) {
            var tmpDocument = new LT.Document(
                -1,                         // Temporal id
                '',                         // Temporal name
                ''                          // Temporal url
            );
            var self = this;                // Avoid scope errors
            var formData = new FormData();  // Data to send

            // Make the request
            formData.append( 'where[id_note]', this._note._id );
            formData.append( 'document', this._createDocuments[ index ] );

            LT.RequestMaker.insert.document(
                formData,
                function ( data ) {
                    if ( data.status === LT.Communicator.SUCCESS ) {
                        tmpDocument._id = data.id_document;
                        tmpDocument._name = data.name;
                        tmpDocument._url = data.url;

                        // Add document
                        self._note.addDocument( tmpDocument );
                    }
                    // Next document
                    self._insertDocument( index + 1, callback );
                }
            );
        } else {
            callback();
        }
    }
};
