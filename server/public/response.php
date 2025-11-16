<?php 
include("../connection/connection.php");

$data = json_decode(file_get_contents("php://input"), true);

if(!$data || !isset($data["message"])){
    echo json_encode([
        "reply" =>"No message received"
    ]);
}

$message = $data["message"];
$reply = "You said: " . $message;

echo json_encode([
    "reply" =>$reply
]);

?>