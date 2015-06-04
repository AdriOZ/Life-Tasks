/**
 * Makes the communication with the server side and creates
 * a note with the params that has been specified.
 * @constructor
 */
LT.NoteCreator = function () {
    this._tmpNote = new LT.Note( -1, '', '', true );
    this._tmpNotebook = -1;
    this._tmpReminders = [];
    this._tmpDocuments = [];
};

// Methods
LT.NoteCreator.prototype = {
    /**
     * Adds the identifier of the notebook that will contain the new note.
     * @param {number} id_notebook Identifier of the notebook that will contain
     *                             the new note.
     */
    addNotebook: function ( id_notebook ) {
        this._tmpNotebook = id_notebook;
    },

    /**
     * Adds the title of the new note.
     * @param {string} title Title of the new note.
     */
    addTitle: function ( title ) {
        this._tmpNote._title = title;
    },

    /**
     * Adds the content of thte new note.
     * @param {string} content Content of the new note.
     */
    addContent: function ( content ) {
        this._tmpNote._content = content;
    },

    /**
     * Adds a new reminder that will be created.
     * @param {string} datetimeString Datetime string.
     */
    addReminder: function ( datetimeString ) {
        this._tmpReminders.push( datetimeString );
    },

    /**
     * Adds a new document that will be created.
     * @param {File} document New document of the note.
     */
    addDocument: function ( document ) {
        this._tmpDocuments.push( document );
    },

    /**
     * Executes the process and calls the callback when finished.
     * @param  {Function} callback Function that will be excuted at the end of
     *                             the process.
     */
    execute: function ( callback ) {
        this._insertNote( callback );
    },

    /*
    Creates the note and calls the function that creates the reminders.
     */
    _insertNote: function ( callback ) {
        var formData = new FormData();  // Object to send
        var self = this;                // Avoid scope errors
        formData.append( 'where[id_notebook]', this._tmpNotebook );
        formData.append( 'where[title]', this._tmpNote._title );
        formData.append( 'where[content]', this._tmpNote._content );

        // Make the request
        LT.RequestMaker.insert.note(
            formData,
            function ( data ) {
                self._tmpNote._id = data.id_note;

                // Insert reminders starting with the first position
                self._insertReminder( 0, callback );
            }
        );
    },

    /*
    Creates reminders recursively calling itself using the index + 1 till the
    index gets out of bounds, then, calls the function that creates the documents.
     */
    _insertReminder: function ( index, callback ) {
        /*
        If the index is higher than the length of the array of reminders
        the function will call the function that inserts documents,
        if not, the function calls itself recursively adding 1 to the index.
         */
        if ( index < this._tmpReminders.length ) {
            var reminder = new LT.Reminder(
                -1,                                      // Temporal id
                this._tmpReminders[ index ],             // Datetime string
                false                                    // Not sent
            );
            var formData = new FormData();               // Data to send
            var datetimeObject = reminder.getDatetime(); // Object with the data
            var self = this;                             // Avoid scope errors.

            // Make the request
            formData.append( 'where[id_note]', this._tmpNote._id );
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
                    self._tmpNote.addReminder( reminder );
                    // Call the function with the next index
                    self._insertReminder( index + 1, callback );
                }
            );
        } else {
            // Call the function to insert the documents
            this._insertDocument( 0, callback );
        }
    },

    /*
    Creates documents recursively calling itself using the index + 1 till the
    index gets out of bounds, then, calls the original callback.
     */
    _insertDocument: function ( index, callback ) {
        /*
         If the index is higher than the length of the array of documents
         the function will call the initial callback,if not, the function
         calls itself recursively adding 1 to the index.
         */
        if ( index <  this._tmpDocuments.length ) {
            var tmpDocument = new LT.Document(
                -1,                         // Temporal id
                '',                         // Temporal name
                ''                          // Temporal url
            );
            var self = this;                // Avoid scope errors
            var formData = new FormData();  // Data to send

            // Make the request
            formData.append( 'where[id_note]', this._tmpNote._id );
            formData.append( 'document', this._tmpDocuments[ index ] );

            LT.RequestMaker.insert.document(
                formData,
                function ( data ) {
                    if ( data.status === LT.Communicator.SUCCESS ) {
                        tmpDocument._id = data.id_document;
                        tmpDocument._name = data.name;
                        tmpDocument._url = data.url;

                        // Add document
                        self._tmpNote.addDocument( tmpDocument );
                    }
                    // Next document
                    self._insertDocument( index + 1, callback );
                }
            );
        } else {
            callback( this._tmpNote );
        }
    }
};