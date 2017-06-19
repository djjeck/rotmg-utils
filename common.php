<?php
forbidDirectAccess();

function forbidDirectAccess() {
  if (!defined('ALLOW_DIRECT_ACCESS')) {
    httpError(404, 'Not Found');
  }
}

function httpError($code, $message) {
  http_response_code($code);
  die($message);
}

function requireMethod($requiredMethod) {
  $method = $_SERVER['REQUEST_METHOD'];
  if ($method != $requiredMethod) {
    httpError(405, "$method not allowed");
  }
}

function requireGetParam($param) {
  if (empty($_GET[$param])) {
    httpError(400, "Missing param $param");
  }
  return $_GET[$param];
}

function requirePostParam($param) {
  if (empty($_POST[$param])) {
    httpError(400, "Missing param $param");
  }
  return $_POST[$param];
}
?>