<?php
/**
 * Hostinger-compatible subscription handler
 * Saves emails to subscribers.json file
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

$email = isset($input['email']) ? trim(strtolower($input['email'])) : '';
$frequency = isset($input['frequency']) ? $input['frequency'] : '';

// Validate inputs
if (empty($email) || empty($frequency)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and frequency are required']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

// Validate frequency
$validFrequencies = ['daily', 'weekly', 'monthly'];
if (!in_array($frequency, $validFrequencies)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid frequency. Choose daily, weekly, or monthly']);
    exit;
}

// File to store subscribers
$dataFile = __DIR__ . '/data/subscribers.json';

// Create data directory if it doesn't exist
if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
}

// Load existing subscribers
$subscribers = [];
if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    $subscribers = json_decode($content, true) ?: [];
}

// Check if email already exists
$existingIndex = -1;
foreach ($subscribers as $index => $sub) {
    if ($sub['email'] === $email) {
        $existingIndex = $index;
        break;
    }
}

// Generate unsubscribe token
$unsubscribeToken = bin2hex(random_bytes(16));

$subscriberData = [
    'email' => $email,
    'frequency' => $frequency,
    'subscribed_at' => date('Y-m-d H:i:s'),
    'unsubscribe_token' => $unsubscribeToken,
    'is_active' => true
];

if ($existingIndex >= 0) {
    // Update existing subscriber
    $subscribers[$existingIndex] = array_merge($subscribers[$existingIndex], $subscriberData);
    $message = 'Subscription updated successfully!';
    $updated = true;
} else {
    // Add new subscriber
    $subscribers[] = $subscriberData;
    $message = 'Subscribed successfully! Check your inbox for confirmation.';
    $updated = false;
}

// Save to file
file_put_contents($dataFile, json_encode($subscribers, JSON_PRETTY_PRINT));

// Send confirmation email using Hostinger mail() function
$subject = 'Welcome to Latest Mortgage Rates Canada Alerts!';
$unsubscribeUrl = 'https://latestmortgagerates.ca/unsubscribe.php?token=' . $unsubscribeToken;

$emailBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Rate Alerts</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; color: #9ca3af; font-size: 12px; padding: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to Latest Mortgage Rates Canada!</h1>
        <p>You're now subscribed to {$frequency} rate alerts</p>
    </div>
    
    <div class="content">
        <h2>What to expect:</h2>
        <ul>
            <li>Best rates from 19 Canadian lenders</li>
            <li>Rate trends and market insights</li>
            <li>Unsubscribe anytime with one click</li>
        </ul>
        
        <p>Your first {$frequency} summary is on its way!</p>
        
        <a href="https://latestmortgagerates.ca" class="button">View Current Rates</a>
    </div>
    
    <div class="footer">
        <p><a href="{$unsubscribeUrl}">Unsubscribe</a></p>
        <p>© 2026 Latest Mortgage Rates Canada</p>
    </div>
</body>
</html>
HTML;

// Set headers for HTML email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: Latest Mortgage Rates <alerts@latestmortgagerates.ca>\r\n";
$headers .= "Reply-To: alerts@latestmortgagerates.ca\r\n";

// Send confirmation email using Hostinger's mail function
mail($email, $subject, $emailBody, $headers);

// Return success
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => $message,
    'unsubscribeToken' => $unsubscribeToken,
    'updated' => $updated ?? false
]);
