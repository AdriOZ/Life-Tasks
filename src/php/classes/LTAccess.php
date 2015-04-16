<?php
class LTAccess {
	/**
	 * Returns the object that performs the action. Throws Exception
	 * if error.
	 * @return LTResponse Object that performs the action.
	 */
	public static function getObject () {
		$this->_checkRequest();	# Throws exception and stop execution.

		# Create object
		$action = $_REQUEST[ 'action' ];
		$table = $_REQUEST[ 'table' ];
		$where = $_REQUEST[ 'where' ];

		if ( $table == Consts::USERS )
			$object = new LTUser( $action, $where );
		elseif ( $table == Consts::NOTEBOOKS )
			$object = new  LTNotebook( $action, $where );
		elseif ( $table == Consts::NOTES )
			$object = new LTNote( $action, $where );
		elseif ( $table == Consts::DOCS )
			$object = new LTDocument( $action, $where );
		else
			$object = new LTReminder( $action, $where );

		return $object;
	}

	/**
	 * Sends an error to the client side.
	 */
	public static function getErrorMessage ( $message ) {
		$errorMessage = array(
			'status' => Consts::ERROR,
			'message' => $message
		);
		return htmlentities( json_encode( $errorMessage ) );
	}

	# Checks if the requested action is correct
	private function _checkAction ( $action ) {
		return $action >= Consts::LOGIN && $action <= Consts::DELETE;
	}

	# Checks if the requested table is correct
	private function _checkTable ( $table ) {
		return $table >= Consts::USERS && $table <= Consts::REMINDERS;
	}

	# Checks if the requested data is correct
	private function _checkWhere ( $where ) {
		return is_array( $where );
	}

	# Checks the full request. Throws exception if error
	private function _checkRequest () {
		if ( !isset( $_REQUEST[ 'action' ] )
			|| !$this->_checkAction( $_REQUEST[ 'action' ] ) ) {
			throw new Exception( 'Error in requested action' );
		}

		if ( !isset( $_REQUEST[ 'table' ] )
			|| !$this->_checkTable( $_REQUEST[ 'table' ] ) ) {
			throw new Exception( 'Error in requested table' );
		}

		if ( !isset( $_REQUEST[ 'where' ] )
			|| !$this->_checkWhere( $_REQUEST[ 'where' ] ) ) {
			throw new Exception( 'Error in requested data' );
		}
	}
}