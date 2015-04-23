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
				case Consts::QUERY: $this->_query();
					break;
				case Consts::INSERT: $this->_insert();
					break;
				case Consts::UPDATE: $this->_update();
					break;
				case Consts::DELETE: $this->_delete();
					break;
				default: $this->_setError();
					break;
			}

			Database::disconnect();
		}

		# Printing results
		return $this->_generateResponse();
	}

	# Returns the results of searching reminders.
	private function _query () {
		if ( !isset( $this->_where[ 'id_note' ] )
			|| !$this->_noteBelongsToUser( $this->_where[ 'id_note' ] ) ) {
			$this->_setError();
		} else {
			$query = "SELECT id_reminder,d_reminder,sended FROM reminders
			WHERE note=".$this->_where[ 'id_note' ];

			try {
				$this->_setResult( 'reminders', Database::query( $query ) );
				$this->_setSuccess();
			} catch ( Exception $e ) {
				$this->_setError();
			}
		}
	}

	# Creates a new reminder.
	private function _insert () {
		if ( !isset( $this->_where[ 'id_note' ] )
			|| !$this->_noteBelongsToUser( $this->_where[ 'id_note' ] )
			|| !$this->_checkDateTime() ) {
			$this->_setError();
		} else {
			$insert = array(
				'note' => $this->_where[ 'id_note' ],
				'd_reminder' => $this->_createDateTime(
					$this->_where[ 'year' ],
					$this->_where[ 'month' ],
					$this->_where[ 'day' ],
					$this->_where[ 'hour' ],
					$this->_where[ 'minute' ]
				)
			);

			# Insert
			try {
				Database::insert( 'reminders', $insert );

				# Get the last id
				$res = Database::query(
					"SELECT max(id_reminder) FROM reminders WHERE note="
					.$this->_where[ 'id_note' ]
				);

				# Return result
				$this->_setResult( 'id_reminder',
					$res[ 0 ][ 'max(id_reminder)' ] );

				# Success
				$this->_setSuccess();
			} catch ( Exception $e ) {
				$this->_setError();
			}
		}
	}

	# Updates the content of a reminder.
	private function _update () {
		if ( !isset( $this->_where[ 'id_reminder' ] )
			|| !$this->_reminderBelongsToUser( $this->_where[ 'id_reminder' ] ) ) {
			$this->_setError();
		} else {
			$update = array();

			# New datetime
			if ( $this->_checkDateTime() ) {
				$update[ 'd_reminder' ] = $this->_createDateTime(
					$this->_where[ 'year' ],
					$this->_where[ 'month' ],
					$this->_where[ 'day' ],
					$this->_where[ 'hour' ],
					$this->_where[ 'minute' ]
				);
			}

			# Sended
			if ( isset( $this->_where[ 'sended' ] ) ) {
				$update[ 'sended' ] = true;
			}

			if ( count( $update ) ) {
				Database::where( 'id_reminder', $this->_where[ 'id_reminder' ] );

				try {
					Database::update( 'reminders', $update );
					$this->_setSuccess();
				} catch ( Exception $e ) {
					$this->_setError();
				}
			} else {
				$this->_setError();		# Nothing to update
			}
		}
	}

	# Deletes a reminder.
	private function _delete () {
		if ( !isset( $this->_where[ 'id_reminder' ] )
			|| !$this->_reminderBelongsToUser( $this->_where[ 'id_reminder' ] ) ) {
			$this->_setError();
		} else {
			Database::where( 'id_reminder', $this->_where[ 'id_reminder' ] );

			try {
				Database::delete( 'reminders' );
				$this->_setSuccess();
			} catch ( Exception $e ) {
				$this->_setError();
			}
		}
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
				&& checkdate( $this->_where[ 'month' ], $this->_where[ 'day' ],
					$this->_where[ 'year' ] )
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