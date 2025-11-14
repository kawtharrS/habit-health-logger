<?php 
include("../models/User.php");
include("../connection/connection.php");
include("../services/ResponseService.php");
function getUserById(){
    global $connection;
    if(isset($_GET["id"])){
        $id = $_GET["id"];
    }
    else{
        echo ResponseService::response(500, 'ID is missing');
        return;
    }

    $user = User::find($connection, $id);
    echo ResponseService::response(200, $user->toArray());
    return;
}
function getAllUsers()
{
    global $connection;
    $users= User::findAll($connection);
    $usersArray=[];
    foreach($users as $user){
        $usersArray[] = $user->toArray();
    }
    echo ResponseService::response(200, $usersArray);
    return;
}

function insertUser(){
    global $connection;

    if(!isset($_POST["name"],$_POST["email"],$_POST["password"],$_POST["role"])){
        return ResponseService::response(400, "Missing required Fields");
    }

    $data= [
        'name'=>$_POST["name"], 
        'email'=>$_POST["email"], 
        'password'=>$_POST["password"],
        'role'=>$_POST["role"]
    ];

    $user = User::create($connection, $data);
    return ResponseService::response(200, $user->toArray());
}
?>
