<?php
include("../connection/config.php");

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.openai.com/v1/chat/completions"); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$data = [
    "model" => "gpt-4o-mini", 
    "messages" => [
        // defining system and user roles 
        [
            "role" => "developer",
            "content" => "You are a specialist nutritionist. Give advice based on user input."
        ],
        [
            "role" => "user",
            "content" => "I sleep 6 hours, drink 1 cup of coffee, went for a run, ate a burger. Give me an overview."
        ]
    ],
];

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $API_KEY,
    "Content-Type: application/json"
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'cURL error: ' . curl_error($ch);
} else {
    $json = json_decode($response, true);
    echo $json['choices'][0]['message']['content'];
}

curl_close($ch);
?>