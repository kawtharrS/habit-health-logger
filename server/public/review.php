<?php
include("../connection/config.php");
include("../connection/connection.php");
include("./response.php");
include("./prompt.php");

if (!$input || !isset($input["message"])) {
    echo json_encode([
        "reply" => "No message received"
    ]);
    exit;
}

$user_content = $input["message"];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.openai.com/v1/responses");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$data = [
    "model" => "gpt-4o-mini",
    "input" => [
        [
            "role" => "system",
            "content" => $prompt],
        [
            "role" => "user",
            "content" => $user_content
        ]
    ],
    "text" => [
        "format" => [
            "type" => "text"
        ]
    ]
];


curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $API_KEY,
    "Content-Type: application/json"
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(["reply" => "cURL error: " . curl_error($ch)]);
    exit;
}

curl_close($ch);

$json = json_decode($response, true);

if (!isset($json['output'][0]['content'][0]['text'])) {
    echo json_encode([
        "reply" => "AI returned no content.",
        "analysis" => null
    ]);
    exit;
}

$full_text = $json['output'][0]['content'][0]['text'];

// Extract JSON block from the AI message
preg_match('/\{.*\}/s', $full_text, $matches);

$analysis_json = null;

if (!empty($matches)) {
    $analysis_json = json_decode($matches[0], true);
}

// Remove JSON from the reply
$visible_reply = trim(str_replace($matches[0] ?? "", "", $full_text));

echo json_encode([
    "reply" => $visible_reply,
    "analysis" => $analysis_json
]);
?>