<?php
include(__DIR__ . '/../connection/connection.php');
include(__DIR__ . '/../models/User.php');
include("ResponseService.php");

function login($email, $password){
    global $connection;

    $sql = "SELECT * FROM users WHERE email = ?";
    $query = $connection->prepare($sql);
    $query->bind_param("s", $email);
    $query->execute();
    $data = $query->get_result()->fetch_assoc();

    if(!empty($data) && password_verify($password, $data['password'])){
        echo ResponseService::response(200, "You are logged in");
        return;
    }

    echo ResponseService::response(401, "Invalid email or password");
}

login("layla@gmail.com","789");
?>
