<?php
include("../connection/config.php");
include("../connection/connection.php");
include("./response.php");


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
            "content" => "Act as a professional habit and health coach give summary feedback response, do not add ** and make it user friendly."
        ],
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

if (isset($json['output'][0]['content'][0]['text'])) {
    echo json_encode([
        "reply" => $json['output'][0]['content'][0]['text']
    ]);
} else {
    echo json_encode(["reply" => "AI returned no content. Response: " . print_r($json, true)]);
}
?>