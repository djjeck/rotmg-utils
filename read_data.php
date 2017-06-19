<?php
define('ALLOW_DIRECT_ACCESS', true);

require_once 'common.php';
require_once 'auth.php';
require_once 'db.php';

requireMethod('GET');
$idToken = requireGetParam('idToken');
$key = requireGetParam('key');

$id = authenticate($idToken);

$connection = connect();
$id = escape($connection, $id);
$key = escape($connection, $key);
$result = selectSingle($connection, <<<MYSQL
  SELECT `blob` FROM `UserData`
  WHERE (
    `google_id` = '$id' AND
    `key` = '$key'
  )
MYSQL
);
close($connection);

echo $result['blob'];
?>