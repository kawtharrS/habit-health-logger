<?php
include(__DIR__ . '/../connection/connection.php');
include(__DIR__ . '/../models/User.php');
include("ResponseService.php");
function login($email, $password){
    global $connection;

    $sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    $query = $connection->prepare($sql);
    $query->bind_param("ss", $email, $password);
    $query->execute();   

    $data = $query->get_result()->fetch_assoc();
    if(!empty($data)){
        echo ResponseService::response(200, "You are logged in");
        return;
    }
    return ResponseService::response(500, "Failed to login");
}

login("john@example.com","123456");



?>