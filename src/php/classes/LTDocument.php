<?php
class LTDocument extends LTResponse {
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
				case Consts::DELETE: $this->_delete();
					break;
				case Consts::USED_STORAGE: $this->_usedStorage();
					break;
				default: $this->_setError();
					break;
			}

			Database::disconnect();
		}

		# Printing results
		return $this->_generateResponse();
	}

	# Returns the data of the documents of the indicated
	# note.
	private function _query () {
		if ( !isset( $this->_where[ 'id_note' ] )
			|| !$this->_noteBelongsToUser( $this->_where[ 'id_note' ] ) ) {
			$this->_setError();
		} else {
			$query = "SELECT id_document,name,url FROM documents WHERE note
			=".$this->_where[ 'id_note' ];

			try {
				$this->_setResult( 'documents', Database::query( $query ) );
				$this->_setSuccess();
			} catch ( Exception $e ) {
				$this->_setError();
			}
		}
	}

	# Creates a new document and uploads it into the folder.
	private function _insert () {
		if ( !isset( $_FILES[ 'document' ] )
			|| !isset( $this->_where[ 'id_note' ] )
			|| !$this->_noteBelongsToUser( $this->_where[ 'id_note' ] ) ) {
			$this->_setError();
		} else {
			$origin = $_FILES[ 'document' ][ 'tmp_name' ];

			# Checks the size
			if ( !$this->_canUploadFile( filesize( $origin ) ) ) {
				$this->_setFileSizeError();
			} else {
				# First insert into the database
				$insert = array(
					'name' => $_FILES[ 'document' ][ 'name' ],
					'url' => 'tmp',		# Temporal name that will be changed
					'note' => $this->_where[ 'id_note' ]
				);

				try {
					Database::insert( 'documents', $insert );

					# Get the id in order to generate a correct path
					$res = Database::query(
						"SELECT max(id_document) FROM documents WHERE note=".
						$this->_where[ 'id_note' ]
					);

					# Real path
					$realPath = $this->_generatePath(
						$res[ 0 ][ 'max(id_document)' ],
						$this->_getExtension( $_FILES[ 'document' ][ 'name' ] )
					);

					# Get the path to move the document
					$partialPath = explode( '/' , $realPath );

					# initial url = php/docs/id_user/document
					# $partialPath[ 0 ] = php
					# $partialPath[ 1 ] = docs
					# $partialPath[ 2 ] = id_user
					# $partialPath[ 3 ] = document
					$partialPath = Consts::FOLDER
									.$partialPath[ 2 ]
									.'/'.
									$partialPath[ 3 ];

					# Move the document
					if ( move_uploaded_file( $origin , $partialPath) ) {
						# Updating content in the database
						$update = array(
							'url' => $realPath
						);
						Database::update( 'documents', $update );

						# Response
						$this->_setSuccess();
						$this->_setResult( 'id_document',
							$res[ 0 ][ 'max(id_document)']  );
					} else {
						$this->_setError();
					}
				} catch ( Exception $e ) {
					$this->_setError();
				}
			}
		}
	}

	# Deletes a document
	private function _delete () {
		if ( !isset( $this->_where[ 'id_document' ] )
			|| !$this->_belongsToUser( $this->_where[ 'id_document' ] ) ) {
			$this->_setError();
		} else {
			# Deleting the document from the folder->get the url
			$path = Database::query( "SELECT url FROM documents WHERE
				id_document=".$this->_where[ 'id_document' ] );
			$name = explode( '/' , $path[ 0 ][ 'url' ] );

			# initial url = php/docs/id_user/document
			# $name[ 0 ] = php
			# $name[ 1 ] = docs
			# $name[ 2 ] = id_user
			# $name[ 3 ] = document
			if ( unlink( $name[ 2 ].'/'.$name[ 3 ] ) ) {
				# Deleting from the database
				Database::where( 'id_document', $this->_where[ 'id_document' ] );
				Database::delete( 'documents' );

				# Updating the percentage of usage
				$this->_usedStorage();
			} else {
				$this->_setError();
			}
		}
	}

	# Returns the percentage of usage of the user folder.
	private function _usedStorage () {
		$percentage = ( $this->_storageSize() / Consts::MAX_FOLDER_SIZE ) * 100;
		$this->_setResult( 'usage', $percentage );
		$this->_setSuccess();
	}

	# Returns the current size of the user folder.
	private function _storageSize () {
		return filesize( Consts::FOLDER.$this->_uid );
	}

	# Returns true if the new file can be uploaded.
	private function _canUploadFile ( $size ) {
		return filesize( Consts::FOLDER.$this->_uid ) + $size < Consts::MAX_FOLDER_SIZE;
	}

	# Generates the path of the file
	private function _generatePath ( $id_document, $extension ) {
		$id_note = Database::query( "SELECT note FROM documents WHERE
			id_document=".$id_document );
		$id_notebook = Database::query( "SELECT notebook FROM notes WHERE
			id_note=".$id_note[ 0 ][ 'note' ] );

		# Creating the path with the format:
		# php/'id_user'/'id_notebook'_'id_note'_'id_document'.'extension'
		# 
		# A common example:
		# php/1/10_5_20.pdf
		return Consts::FOLDER_INDEX    				# General path 
				.$this->_uid.'/'					# User folder
				.$id_notebook[ 0 ][ 'notebook' ]	# Notebook id
				.'_'								# Separator
				.$id_note[ 0 ][ 'note' ]			# Note id
				.'_'								# Separator
				.$id_document						# Document id
				.'.'.$extension;					# Extesion of the document
	}

	# Returns the extension from a filename.
	private function _getExtension ( $filename ) {
		$parts = explode( '.' , $filename );
		return end( $parts );
	}

	# Returns true if the document belongs to the user.
	private function _belongsToUser ( $id_document ) {
		$res = Database::query(
			"SELECT id_document FROM documents WHERE id_document=".$id_document
			." AND note IN (SELECT id_note FROM notes WHERE notebook
			IN (SELECT id_notebook FROM notebooks WHERE owner=".$this->_uid."))"
		);

		return count( $res ) > 0;
	}

	# Returns true if the note belongs to the user.
	private function _noteBelongsToUser ( $id_note ) {
		$res = Database::query(
			"SELECT id_note FROM notes WHERE id_note=".$id_note." AND
			notebook IN (SELECT id_notebook FROM notebooks WHERE owner
			=".$this->_uid.")"
		);

		return count( $res ) > 0;
	}

	# Sets the status of the response telling the client that there
	# is no storage to upload the file.
	private function _setFileSizeError () {
		$this->_result[ 'status' ] = Consts::NO_STORAGE;
	}

	# Returns the name of the file without the path.
	private function _getFileName ( $path ) {
		return end( explode( '/' ,  $path ) );
	}
}