<?php
class LTNotebook extends LTResponse {
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

	# Search the data of notebooks.
	private function _query () {
		$query = "SELECT id_notebook, name FROM notebooks WHERE
		owner=".$this->_uid;

		if ( isset( $this->_where[ 'id_notebook' ] ) ) {
			$query .= ' AND id_notebook='.$this->_where[ 'id_notebook' ];
		} elseif ( isset( $this->_where[ 'name' ] ) ) {
			$query .= " AND name LIKE '%".$this->_where[ 'name' ]."%'";
		}

		try {
			$this->_setResult( 'notebooks', Database::query( $query ) );
			$this->_setSuccess();
		} catch ( Exception $e ) {
			$this->_setError();
		}
	}

	# Creates a new Notebook.
	private function _insert () {
		if ( !isset( $this->_where[ 'name' ] )
			|| !strlen( $this->_where[ 'name' ] )
			|| $this->_notebookExists( $this->_where[ 'name' ] ) ) {
			$this->_setError();
		} else {
			$insert = array(
				'name' => $this->_where[ 'name' ],
				'owner' => $this->_uid
			);

			try {
				Database::insert( 'notebooks', $insert );

				# Get the las notebook id
				$res = Database::query( "SELECT max(id_notebook) FROM notebooks
					WHERE owner=".$this->_uid );
				$this->_setResult( 'id_notebook', $res[ 0 ][ 'max(id_notebook)' ] );
				$this->_setSuccess();
			} catch ( Exception $e ) {
				$this->_setError();
			}
		}
	}

	# Updates the name of an existing notebook.
	private function _update () {
		if ( !isset( $this->_where[ 'id_notebook' ] )
			|| !isset( $this->_where[ 'name' ] )
			|| !strlen( $this->_where[ 'name' ] )
			|| !$this->_belongsToUser( $this->_where[ 'id_notebook' ] )
			|| $this->_notebookExists( $this->_where[ 'name' ] ) ) {
			$this->_setError();
		} else {
			$update = array( 'name' => $this->_where[ 'name' ] );
			Database::where( 'id_notebook', $this->_where[ 'id_notebook' ] );

			try {
				Database::update( 'notebooks', $update );
				$this->_setSuccess();
			} catch ( Exception $e ) {
				$this->_setError();
			}
		}
	}

	# Deletes a notebook and all its notes.
	private function _delete () {
		if ( isset( $this->_where[ 'id_notebook' ] )
			&& $this->_belongsToUser( $this->_where[ 'id_notebook' ] ) ) {
			Database::where( 'id_notebook', $this->_where[ 'id_notebook' ] );
			try {
				Database::delete();
				$this->_deleteDocuments();
				$this->_setSuccess();
			} catch ( Exception $e ) {
				$this->_setError();
			}
		} else {
			$this->_setError();
		}
	}

	# Checks if the notebook belongs to the user.
	private function _belongsToUser ( $id_notebook ) {
		$res = Database::query( "SELECT id_notebook FROM notebooks WHERE
			id_notebook=".$id_notebook." AND owner=".$this->_uid );

		return count( $res ) > 0;
	}

	# Deletes all documents in the user folder that belong to
	# some note contained in the notebook.
	private function _deleteDocuments ( $id_notebook ) {
		$path = Consts::FOLDER.$this->_uid;

		# Deleting files contained in the notebook.
		foreach ( glob( $path.'/'.$id_notebook.'_*' ) as $file ) {
			unlink( $file );
		}
	}

	# Checks if a notebook with the indicated name exists in the
	# database.
	private function _notebookExists ( $name ) {
		$res = Database::query( "SELECT id_notebook FROM notebooks WHERE
			owner=".$this->_uid." AND name='".$name."'" );
		return count( $res ) > 0;
	}
}