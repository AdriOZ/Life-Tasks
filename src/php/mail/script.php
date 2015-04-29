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

######################### Begin of the script ########################