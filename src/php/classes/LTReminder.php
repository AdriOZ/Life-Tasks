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
}