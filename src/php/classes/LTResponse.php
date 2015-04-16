<?php
abstract class LTResponse {
	/**
	 * Requested action.
	 * @var integer
	 */
	protected $_action;

	/**
	 * Data from request.
	 * @var array
	 */
	protected $_where;

	/**
	 * Results of the request.
	 * @var array
	 */
	protected $_result;

	/**
	 * User id.
	 * @var integer
	 */
	protected $_uid;

	/**
	 * Sets the data from the request.
	 */
	public function __construct ( $action, $where ) {
		$this->_action = $action;
		$this->_where = $where;
		$this->_uid = isset( $_SESSION[ 'uid' ] )
				? $_SESSION[ 'uid' ]
				: NULL;
	}

	/**
	 * Closes the connection to the database.
	 */
	public function __destruct () {
		Database::disconnect();
	}

	/**
	 * Performs the requested action.
	 */
	public abstract function execute ();

	# Sets the value of the status of the response to
	# success.
	protected function _setSuccess () {
		$this->_result[ 'status' ] = Consts::SUCCESS;
	}

	# Sets the value of the status of the response to
	# error.
	protected function _setError () {
		$this->_result[ 'status' ] = Consts::ERROR;
	}

	# Sets a new value in the response.
	protected function _setResult ( $name, $value ) {
		$this->_result[ $name ] = $value;
	}

	# Prints the result to the client side.
	protected function _generateResponse () {
		return  htmlentities( json_encode( $this->_result ) );
	}
}