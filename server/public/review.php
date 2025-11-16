<?php
include("../connection/config.php");

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $URL_OPENAI);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true); //to make a HTTP post

$data = [
    "model" => "gpt-4.1-mini",
    "input" => [
        "You are a specialist nutritionist. Give advice based on user input: 
        I sleep 6 hours, drink 1 cup of coffee, went for a run, ate a burger. Give me an overview."
    ]
];

// data to POST
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

// Set the headers to Post
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $API_KEY, //set the key
    "Content-Type: application/json"
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'cURL error: ' . curl_error($ch);
} else {
    $json = json_decode($response, true);
    echo $json['output'][0]['content'][0]['text']; //the ai response

}

curl_close($ch);
?>
