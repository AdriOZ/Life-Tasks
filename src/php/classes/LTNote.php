<?php
class LTNote extends LTResponse {
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

	# Returns the result of searching a note.
	private function _query () {
		if ( !isset( $this->_where[ 'id_notebook' ] )
			|| !$this->_notebookBelongsToUser( $this->_where[ 'id_notebook' ] ) ) {
			$this->_setError();
		} else {
			$query = "SELECT id_note,title,content,active FROM notes WHERE
			notebook=".$this->_where[ 'id_notebook' ];

			# Other filters
			if ( isset( $this->_where[ 'id_note' ] ) ) {
				$query .= " AND id_note=".$this->_where[ 'id_note' ];
			} else {	# The id doesn't need more filters.
				if ( isset( $this->_where[ 'title' ] ) ) {
					$query .= " AND title LIKE '%".$this->_where[ 'title' ]."%'";
				}
				if ( isset( $this->_where[ 'content' ] ) ) {
					$query .= " AND content LIKE '%".$this->_where[ 'content' ]."%'";
				}
				if ( isset( $this->_where[ 'active' ] ) ) {
					$query .= " AND active=TRUE";
				}
			}

			# Execute the query
			try {
				$res = Database::query( $query );
				$this->_setSuccess();
				$this->_setResult( 'notes', $res );
			} catch ( Exception $e ) {
				$this->_setError();
			}
		}
	}

	# Creates a new note
	private function _insert () {
		if ( !isset( $this->_where[ 'title' ] )
			|| !isset( $this->_where[ 'content' ] )
			|| !isset( $this->_where[ 'id_notebook' ] )
			|| !strlen( $this->_where[ 'title' ] )
			|| !$this->_notebookBelongsToUser( $this->_where[ 'id_notebook' ] ) ) {
			$this->_setError();
		} else {
			$insert = array(
				'title' => $this->_where[ 'title' ],
				'content' => $this->_where[ 'content' ],
				'notebook' => $this->_where[ 'id_notebook' ]
			);

			try {
				Database::insert( 'notes', $insert );

				# Getting the last id
				$res = Database::query(
					"SELECT max(id_note) FROM notes WHERE notebook=".
					$this->_where[ 'id_notebook' ]
				);

				# Results
				$this->_setSuccess();
				$this->_setResult( 'id_note', $res[ 0 ][ 'max(id_note)' ] );
			} catch ( Exception $e ) {
				$this->_setError();
			}
		}
	}

	# Updates the note title, content or status.
	private function _update () {
		if ( !isset( $this->_where[ 'id_note' ] )
			|| !isset( $this->_where[ 'id_notebook' ] )
			|| !$this->_noteBelongsToUser( $this->_where[ 'id_note' ], $this->_where[ 'id_notebook' ] ) ) {
			$this->_setError();
		} else {
			$update = array();

			# Title
			if ( isset( $this->_where[ 'title' ] )
				&& strlen( $this->_where[ 'title' ] ) ) {
				$update[ 'title' ] = $this->_where[ 'title' ];
			}

			# Content
			if ( isset( $this->_where[ 'content' ] ) ) {
				$update[ 'content' ] = $this->_where[ 'content' ];
			}

			# Active status
			if ( isset( $this->_where[ 'active' ] ) ) {
				$update[ 'active' ] = true;
			}

			# Nothing to update -> error
			if ( !count( $update ) ) {
				$this->_setError();
			} else {
				Database::where( 'id_note', $this->_where[ 'id_note' ] );

				try {
					Database::update( 'notes', $update );
					$this->_setSuccess();
				} catch ( Exception $e ) {
					$this->_setError();
				}
			}
		}
	}

	# Deactivates or purge the note.
	private function _delete () {
		if ( !isset( $this->_where[ 'id_note' ] )
			|| !isset( $this->_where[ 'id_notebook' ] )
			|| !$this->_noteBelongsToUser( $this->_where[ 'id_note' ], $this->_where[ 'id_notebook' ] ) ) {
			$this->_setError();
		} else {
			if ( $this->_isActive( $this->_where[ 'id_note' ] ) ) {
				$this->_deactivateNote( $this->_where[ 'id_note' ] );
			} else {
				$this->_purge( $this->_where[ 'id_note' ] );
			}
		}
	}

	# Checks if the note belongs to the user.
	private function _noteBelongsToUser ( $id_note, $id_notebook ) {
		$res = Database::query(
				"SELECT id_note FROM notes WHERE id_note=".$id_note.
				" AND notebook=(SELECT id_notebook FROM notebooks WHERE
				id_notebook=".$id_notebook." AND owner=".$this->_uid.")"			
			);
		return count( $res ) > 0;
	}

	# Checks if a notebook belongs to the user.
	private function _notebookBelongsToUser ( $id_notebook ) {
		$res = Database::query( "SELECT id_notebook FROM notebooks WHERE
			id_notebook=".$id_notebook." AND owner=".$this->_uid );

		return count( $res ) > 0;
	}

	# Deletes all documents of the note.
	private function _deleteDocuments ( $id_notebook, $id_note) {
		$path = Consts::FOLDER.$this->_uid;

		# Deleting files contained in the note.
		foreach ( glob( $path.'/'.$id_notebook.'_'.$id_note.'_*' ) as $file ) {
			unlink( $file );
		}
	}

	# Checks if the note is active.
	private function _isActive ( $id_note ) {
		$res = Database::query( "SELECT id_note FROM notes WHERE id_note=".
		$id_note." AND active=true" );

		return count( $res ) > 0;
	}

	# Deactives the note.
	private function _deactivateNote ( $id_note ) {
		Database::where( 'id_note', $id_note );

		try {
			Database::update( 'notes', array( 'active' => false ) );
			$this->_setSuccess();
		} catch ( Exception $e ) {
			$this->_setError();
		}
	}

	# Drops the note.
	private function _purge ( $id_note ) {
		Database::where( 'id_note', $id_note );
		Database::delete( 'notes' );
		$this->_deleteDocuments();
		$this->_setSuccess();
	}
}