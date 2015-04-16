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
}