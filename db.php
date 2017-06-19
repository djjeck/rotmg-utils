<?php
require_once 'common.php';
require_once 'credentials.php';

forbidDirectAccess();

function connect() {
  $connection = new mysqli(constant('DB_HOST'), constant('DB_USER'), constant('DB_PASSWORD'), constant('DB_NAME'));
  if ($connection->connect_error) {
    httpError(500, "Could not connect to DB: {$connection->connect_error}");
  }
  return $connection;
}

function query($connection, $query) {
  $result = $connection->query($query);
  if ($result === false) {
    httpError(500, "Error executing query: {$connection->error}");
  }
  return $result;
}

function select($connection, $query) {
  $rows = array();
  $result = query($connection, $query);
  while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
  }
  return $rows;
}

function selectSingle($connection, $query) {
  $result = select($connection, $query);
  $size = count($result);
  if ($size != 1) {
    httpError(500, "Error executing query. Expecting 1 result, got $size");
  }
  return $result[0];
}

function escape($connection, $value) {
  return $connection->real_escape_string($value);
}

function close($connection) {
  return $connection->close();
}
?>