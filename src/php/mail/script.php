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
######################### Begin of the script ########################