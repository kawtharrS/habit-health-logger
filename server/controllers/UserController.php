<?php 
include(__DIR__ . '/../models/User.php');
include(__DIR__ . '/../connection/connection.php');
require_once(__DIR__ . '/../services/ResponseService.php');

class UserController{
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

    function deleteUser() {
        global $connection;

        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data["id"])) {
            echo ResponseService::response(400, "Missing Id");
            return;
        }

        $id = $data["id"];

        $success = User::delete($connection, $id);
        if ($success) {
            echo ResponseService::response(200, "deleted");
        } else {
            echo ResponseService::response(500, "failed to delete");
        }
    }


    function updateUser() {
        global $connection;

        if (empty($_POST["id"])) {
            return ResponseService::response(400, "ID is required");
        }

        $data = [];
        $id = $_POST["id"];

        if (!empty($_POST["name"])) {
            $data["name"] = $_POST["name"];
        }
        if (!empty($_POST["email"])) {
            $data["email"] = $_POST["email"];
        }
        if (!empty($_POST["password"])) {
            $data["password"] = $_POST["password"];
        }
        if (!empty($_POST["role"])) {
            $data["role"] = $_POST["role"];
        }

        if (empty($data)) {
            return ResponseService::response(400, "No fields to update");
        }

        $updatedUser = User::update($connection,$data, $id);
        $updatedUser = User::find($connection, $id);


        return ResponseService::response(200, $updatedUser->toArray());
    }
}
?>
