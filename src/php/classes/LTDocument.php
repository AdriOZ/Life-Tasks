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
				case Consts::QUERY: # TODO
					break;
				case Consts::INSERT: # TODO
					break;
				case Consts::UPDATE: # TODO
					break;
				case Consts::DELETE: # TODO
					break;
				case Consts::USED_STORAGE: # TODO
					break;
				default: $this->_setError();
					break;
			}

			Database::disconnect();
		}

		# Printing results
		return $this->_generateResponse();
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
				Database::delete();

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
}