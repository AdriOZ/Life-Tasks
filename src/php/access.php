<?php
@session_start();
header( 'Content-type: application/json' );

# Files
require 'classes/export.php';

try {
	$object = LTAccess::getObject();
	$response = $object->execute();
} catch ( Exception $e ) {
	$response = LTAccess::getErrorMessage( $e->getMessage() );
}

echo $response;