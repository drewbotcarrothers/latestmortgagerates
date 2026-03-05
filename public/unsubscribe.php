<?php
/**
 * Hostinger-compatible unsubscribe handler
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Get token from query string
$token = isset($_GET['token']) ? $_GET['token'] : '';

if (empty($token)) {
    header('Location: /unsubscribe.html?error=missing_token');
    exit;
}

// File to store subscribers
$dataFile = __DIR__ . '/data/subscribers.json';

// Load existing subscribers
if (!file_exists($dataFile)) {
    header('Location: /unsubscribe.html?error=not_found');
    exit;
}

$subscribers = json_decode(file_get_contents($dataFile), true) ?: [];

// Find subscriber by token
$found = false;
foreach ($subscribers as $index => $sub) {
    if (isset($sub['unsubscribe_token']) && $sub['unsubscribe_token'] === $token) {
        $subscribers[$index]['is_active'] = false;
        $subscribers[$index]['unsubscribed_at'] = date('Y-m-d H:i:s');
        $found = true;
        break;
    }
}

if (!$found) {
    header('Location: /unsubscribe.html?error=invalid_token');
    exit;
}

// Save updated subscribers
file_put_contents($dataFile, json_encode($subscribers, JSON_PRETTY_PRINT));

// Redirect to success page
header('Location: /unsubscribed');
exit;
