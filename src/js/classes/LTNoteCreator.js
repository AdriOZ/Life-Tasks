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
    addNotebook: function ( id_notebook ) {
        this._tmpNotebook = id_notebook;
    },

    addTitle: function ( title ) {
        this._tmpNote._title = title;
    },

    addContent: function ( content ) {
        this._tmpNote._content = content;
    },

    addReminder: function ( datetimeString ) {
        this._tmpReminders.push( datetimeString );
    },

    addDocument: function ( document ) {
        this._tmpDocuments.push( document );
    },

    execute: function ( callback ) {
        this._insertNote( callback );
    },

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
    },

    _extractFileName: function ( path ) {
        var fullPath = path
        if ( fullPath ) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
            return filename;
        }
    }
};