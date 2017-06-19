<?php
define('ALLOW_DIRECT_ACCESS', true);

require_once 'common.php';
require_once 'auth.php';
require_once 'db.php';

requireMethod('POST');
$idToken = requirePostParam('idToken');
$key = requirePostParam('key');
$data = requirePostParam('data');

$id = authenticate($idToken);

$connection = connect();
$id = escape($connection, $id);
$key = escape($connection, $key);
$data = escape($connection, $data);
query($connection, <<<MYSQL
  REPLACE INTO `UserData`
    (`google_id`, `key`, `blob`)
    VALUES
    ('$id', '$key', '$data')
MYSQL
);
close($connection);

echo "Valid token, user id $id";
?>