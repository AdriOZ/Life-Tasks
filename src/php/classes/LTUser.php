<?php 
class LTUser extends LTResponse {
	public function __construct( $action, $where ) {
		parent::__construct( $action, $where );
	}

	public function execute () {
		Database::connect();	# Only one point of connection.

		# Perform the action
		switch ( $this->_action ) {
			case Consts::LOGIN: $this->_login();
				break;
			case Consts::LOGOUT: $this->_logout();
				break;
			case Consts::INSERT: $this->_register();
				break;
			case Consts::UPDATE:
				if ( !is_null( $this->_uid ) ) {
					$this->_update();
				} else {
					$this->_setError();
				}
				break;
			case Consts::DELETE:
				if ( !is_null( $this->_uid ) ) {
					$this->_delete();
				} else {
					$this->_setError();
				}
				break;
			default: $this->_setError();
				break;
		}

		Database::disconnect();
		return $this->_generateResponse();
	}

	# Creates a new user with the credentials from the request.
	private function _register () {
		if ( !isset( $this->_where[ 'email' ] )
			|| !isset( $this->_where[ 'pass' ] )
			|| $this->_emailExists( $this->_where[ 'email' ] )
			|| !$this->_checkEmail( $this->_where[ 'email' ] )
			|| !$this->_checkPassword( $this->_where[ 'pass' ] ) ) {
			$this->_setError();
		} else {
			$insert = array(
				'email' => $this->_where[ 'email' ],
				'password' => sha1( $this->_where[ 'pass' ] )
			);

			try {
				Database::insert( 'users', $insert );

				# Return the uid
				$res = Database::query( "SELECT id_user FROM users WHERE email=
					'".$this->_where[ 'email' ]."'" );

				$this->_setResult( 'uid', $res[ 0 ][ 'id_user' ] );

				# Session
				$this->_uid = $_SESSION[ 'uid' ] = $res[ 0 ][ 'id_user' ];

				# Folder
				if ( $this->_createFolder() ) {
					$this->_setSuccess();
				} else {
					$this->_setError();
				}
			} catch ( Exception $e ) {
				$this->_setError();
			}
		}
	}

	# Starts the session with the user id with the email and the password
	# from the requests if the credentials are correct.
	private function _login () {
		if ( !isset( $this->_where[ 'email' ] )
			|| !isset( $this->_where[ 'pass' ] ) ) {
			$this->_setError();
		} else {
			try {
				$res = Database::query( "SELECT id_user FROM users WHERE email='".
					$this->_where[ 'email' ]."' AND password='".
					sha1( $this->_where[ 'pass' ] )."'" );

				if ( count( $res ) ) {
					$_SESSION[ 'uid' ] = $res[ 0 ][ 'id_user' ];
					$this->_setSuccess();
					$this->_setResult( 'uid', $res[ 0 ][ 'id_user' ] );
				} else {
					$this->_setError();
				}
			} catch ( Exception $e ) {
				$this->_setError();
			}
		}
	}

	# Closes the session.
	private function _logout () {
		if ( !is_null( $this->_uid ) ) {
			unset( $_SESSION[ 'uid' ] );
			$this->_setSuccess();
		} else {
			$this->_setError();
		}
	}

	# Updates the credentials
	private function _update () {
		$update = array();

		if ( isset( $this->_where[ 'email' ] )
			&& $this->_checkEmail( $this->_where[ 'email' ] )
			&& !$this->_emailExists( $this->_where[ 'email' ] ) ) {
			$update[ 'email' ] = $this->_where[ 'email' ];
		}

		if ( isset( $this->_where[ 'pass' ] )
			&& $this->_checkPassword( $this->_where[ 'pass' ] ) ) {
			$update[ 'password' ] = sha1( $this->_where[ 'pass' ] );
		}

		if ( count( $update ) ) {
			try {
				Database::where( 'id_user', $this->_uid );
				Database::update( 'users', $update );
				$this->_setSuccess();
			} catch ( Exception $e ) {
				$this->_setError();
			}
		} else {
			$this->_setError();		# Nothing to update
		}
	}

	# Deletes the account and folder.
	private function _delete () {
		Database::where( 'id_user', $this->_uid );
		try {
			Database::delete( 'users' );
			unset( $_SESSION[ 'uid' ] );	# close session

			# Folder
			if ( $this->_deleteFolder() ) {
				$this->_setSuccess();
			} else {
				$this->_setError();
			}
		} catch ( Exception $e ) {
			$this->_setError();
		}
	}

	# Checks if the email exists in the database, and returns
	# true if it's already registered.
	private function _emailExists ( $email ) {
		$res = Database::query( "SELECT id_user FROM users WHERE email='"
			.$email."'" );

		return count( $res ) > 0;
	}

	# Checks if the email has a valid format.
	private function _checkEmail ( $mail ) {
		return filter_var( $mail, FILTER_VALIDATE_EMAIL );
	}

	# Checks if the password is not empty.
	private function _checkPassword ( $pass ) {
		return strlen( $pass ) > 0;
	}

	# Creates the folder of the user that has been registered
	private function _createFolder () {
		$path = Consts::FOLDER.$this->_uid;		# Name of the folder is the uid
		return mkdir( $path ) && chmod( $path , 0777 );
	}

	# Deletes the content and the user folder.
	private function _deleteFolder () {
		$path = Consts::FOLDER.$this->_uid;

		/* Deleting content */
		foreach ( glob( $path.'/*' ) as $file ) {
			unlink( $file );
		}

		/* Deleting the folder */
		return rmdir( $path );
	}
}