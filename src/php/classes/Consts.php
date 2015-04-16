<?php
class Consts {
	/* Status */
	const ERROR = 0;		# Error message.
	const SUCCESS = 1;		# Success message.
	const NO_STORAGE = 2;	# Limit storage per user reached.

	/* Session */
	const LOGIN = 0;		# Login request.
	const LOGOUT = 1;		# Log-out request.
	const USED_STORAGE = 2;	# Return the percentage of used storage.

	/* DB */
	const QUERY = 3;		# Request of searching data from the database.
	const INSERT = 4;		# Request of inserting data into the database.
	const UPDATE = 5;		# Update data of the database.
	const DELETE = 6;		# Delete data of the database.

	/* Tables */
	const USERS = 0;		# DB operation with users.
	const NOTEBOOKS = 1;	# DB operation with notebooks.
	const NOTES = 2;		# DB operation with notes.
	const DOCS = 3;			# DB operation with documents.
	const REMINDERS = 4;	# DB operation with reminders.

	/* Other */
	const FOLDER = 'docs/';	# Path of the folder that contains the documents of the users.
	const FOLDER_INDEX = 'php/docs/';	# Path of the folder from the index.
	const MAX_FOLDER_SIZE = 10000000;	# Maximum size of the user folder (10MB)
}