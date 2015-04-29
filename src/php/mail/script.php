<?php 
require 'PHPMailer-master/class.phpmailer.php';		# To send emails
require '../classes/bbdd.php';						# Connect to the database

############################# Functions #############################
/**
 * Search the reminders that must be sended.
 * @return [array] Array of reminders.
 */
function getReminders () {
	return Database::query(
		"SELECT id_reminder,note FROM reminders WHERE sent=0 AND d_reminder
		<= sysdate()"
	);
}

/**
 * Search the title, content and notebook of the note with the
 * specific id.
 * @param  integer $id_note Identifier of the note.
 * @return array          Array of notes.
 */
function getNotes ( $id_note ) {
	return Database::query(
		"SELECT title,content,notebook FROM notes WHERE ative=1
		AND id_note=".$id_note
	);
}

/**
 * Search the email of the user that has the specific notebook.
 * @param  integer $id_notebook Identifier of the notebook.
 * @return array              Array with the data.
 */
function getEmail ( $id_notebook ) {
	return Database::query(
		"SELECT email FROM users WHERE id_user = (SELECT owner FROM notebooks
		WHERE id_notebook=".$id_notebook.")"
	);
}

/**
 * Updates the status of the reminder with the spicific id.
 * @param  integer $id_reminder Identifier of the reminder.
 */
function updateReminder ( $id_reminder ) {
	Database::where( 'id_reminder', $id_reminder );
	Database::update( 'reminders', array( 'sent', 1 ) );
}

/**
 * Search the documents associated with the note.
 * @param  integer $id_note Identifier of the note.
 */
function getFiles ( $id_note ) {
	return Database::query(
		"SELECT name,url FROM documents WHERE note=".$id_note
	);
}

/**
 * Converts the relative path of the documents to be correct
 * for the actual path.
 * @param  string $origin Original path.
 * @return string         Correct path.
 */
function convertPath ( $origin ) {
	# Origin: php/docs/'id_user'/'document'
	# Real: ../docs/'id_user'/'document'
	$parts = explode( '/', $origin );
	$parts[ 0 ] = '..';
	return implode( '/' , $parts );
}
######################### Begin of the script ########################