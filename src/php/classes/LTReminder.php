<?php
class LTReminder extends LTResponse {
	public function __construct( $action, $where ) {
		parent::__construct( $action, $where );
	}

	public function execute () {
		if ( is_null( $this->_uid ) ) {
			$this->_setError();
		} else {
			Database::connect();	# Only one point of connection

			# Perform the action
			switch ( $this->_action ) {
				case Consts::QUERY: # TODO
					break;
				case Consts::INSERT: # TODO
					break;
				case Consts::UPDATE: # TODO
					break;
				case Consts::DELETE: # TODO
					break;
				default: $this->_setError();
					break;
			}

			Database::disconnect();
		}

		# Printing results
		return $this->_generateResponse();
	}

	# Checks if the year is correct.
	private function _isValidYear ( $year ) {
		$check = intval( date( 'Y' ) );
		return intval( $year ) >= $check;
	}

	# Checks if the month is correct.
	private function _isValidMonth ( $month ) {
		return $month >= 1 && $month <= 12;
	}

	# Checks if the day is correct.
	private function _isValidDay ( $day ) {
		return $day >= 1 && $day <= 31;
	}

	# Checks if the hour is correct.
	private function _isValidHour ( $hour ) {
		return $hour >= 0 && $hour <= 23;
	}

	# Checks if the minute is valid.
	private function _isValidMinute ( $minute ) {
		return $minute >= 0 && $minute <= 59;
	}

	# Returns a datetime that can be inserted into the database.
	# YYYY-MM-DD HH:MM:SS
	# Seconds are 00 by default
	private function _createDateTime ( $year, $month, $day, $hour, $minute,
		$second = '00' ) {
		return sprintf(
			"%'.04d-%'.02d-%'.02d %'.02d:%'.02d:%'.02d",
			$year,
			$month,
			$day,
			$hour,
			$minute,
			$second
		);
	}

	# Checks if the request has the values needed to create
	# a datetime.
	private function _checkDateTime () {
		return isset( $this->_where[ 'year' ] )
				&& isset( $this->_where[ 'month' ] )
				&& isset( $this->_where[ 'day' ] )
				&& isset( $this->_where[ 'hour' ] )
				&& isset( $this->_where[ 'minute' ] )
				&& $this->_isValidYear( $this->_where[ 'year' ] )
				&& $this->_isValidMonth( $this->_where[ 'month' ] )
				&& $this->_isValidDay( $this->_where[ 'day' ] )
				&& $this->_isValidHour( $this->_where[ 'hour' ] )
				&& $this->_isValidMinute( $this->_where[ 'minute' ] );
	}

	# Checks if the note belongs to the user.
	private function _noteBelongsToUser ( $id_note ) {
		$res = Database::query(
			"SELECT id_note FROM notes WHERE id_note=".$id_note." AND
			notebook IN (SELECT id_notebook FROM notebooks WHERE owner="
			.$this->_uid.")"
		);
		return count( $res ) > 0;
	}

	# Checks if the reminder belongs to the user.
	private function _reminderBelongsToUser ( $id_reminder ) {
		$res = Database::query(
			"SELECT id_reminder FROM reminders WHERE id_reminder=".$id_reminder
			." AND note IN (SELECT id_note FROM notes WHERE notebook IN (SELECT
			id_notebook FROM notebooks WHERE owner=".$this->_uid."))"
		);
		return count( $res ) > 0;
	}
}