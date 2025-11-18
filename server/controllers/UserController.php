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

        $input = $_POST;
        if (empty($input)) {
            $input = json_decode(file_get_contents("php://input"), true);
        }

        if(!isset($input["name"], $input["email"], $input["password"], $input["role"])){
            return ResponseService::response(400, "Missing required Fields");
        }

        $input["password"] = password_hash($input["password"], PASSWORD_ARGON2I );
        $data = [
            'name' => $input["name"], 
            'email' => $input["email"], 
            'password' => $input["password"],
            'role' => $input["role"]
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
        $entry = User::find($connection, $id);
        $success = $entry->delete($connection);

        if ($success) {
            echo ResponseService::response(200, "deleted");
        } else {
            echo ResponseService::response(500, "failed to delete");
        }
    }



    function updateUser() {

        global $connection;
        $input = json_decode(file_get_contents("php://input"), true);


        if (empty($input["id"])) {
            return ResponseService::response(400, "ID is required");
        }

        $data = [];
        $id = $input["id"];

        if (!empty($input["name"])) {
            $data["name"] = $input["name"];
        }
        if (!empty($_POST["email"])) {
            $data["email"] = $input["email"];
        }
        if (!empty($_POST["password"])) {
            $data["password"] = $input["password"];
        }
        if (!empty($_POST["role"])) {
            $data["role"] = $input["role"];
        }

        if (empty($data)) {
            return ResponseService::response(400, "No fields to update");
        }

        $entry = User::find($connection, $id);
        $entry->update($connection, $data);
        $updatedUser = User::find($connection, $id);


        return ResponseService::response(200, $updatedUser->toArray());
    }


}
?>
