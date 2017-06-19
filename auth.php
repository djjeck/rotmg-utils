<?php
require_once 'common.php';
require_once 'lib/google-api-php-client/vendor/autoload.php';

forbidDirectAccess();

$clientId = '127841094108-km6bcils31kjpqk19i3pv4lsp086kmma.apps.googleusercontent.com';

function authenticate($tokenId) {
  $client = new Google_Client(['client_id' => $clientId]);
  $payload = $client->verifyIdToken($tokenId);
  if ($payload) {
    $userid = $payload['sub'];
    return $userid;
  } else {
    httpError(403, 'Error authenticating user');
  }
}
?>