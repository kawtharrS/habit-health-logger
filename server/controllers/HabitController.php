<?php 
include(__DIR__ . '/../models/Habit.php');
include(__DIR__ . '/../connection/connection.php');
require_once(__DIR__ . '/../services/ResponseService.php');

class HabitController{
    function getHabitById(){
        global $connection;
        
        if(isset($_GET["id"])){
            $id = $_GET["id"];
        }
        else{
            echo ResponseService::response(500, 'ID is missing');
            return;
        }

        $habit = Habit::find($connection, $id);
        echo ResponseService::response(200, $habit->toArray());
        return;
    }
    function getAllHabits()
    {
        global $connection;
        $habits= Habit::findAll($connection);
        $habitsArray=[];
        foreach($habits as $habit){
            $habitsArray[] = $habit->toArray();
        }
        echo ResponseService::response(200, $habitsArray);
        return;
    }

    function insertHabit(){
        global $connection;

        $input = $_POST;
        if (empty($input)) {
            $input = json_decode(file_get_contents("php://input"), true);
        }

        if(!isset($input["user_id"], $input["habit_name"], $input["unit"], $input["is_active"])){
            return ResponseService::response(400, "Missing required Fields");
        }

        $data = [
            'user_id' => $input["user_id"],
            'habit_name' => $input["habit_name"],
            'unit' => $input["unit"],
            'value' => $input["value"] ?? null,
            'is_active' => $input["is_active"]
        ];

        $habit = Habit::create($connection, $data);
        return ResponseService::response(200, $habit->toArray());
    }

    function deleteHabit() {
        global $connection;

        $data = json_decode(file_get_contents("php://input"), associative: true);

        if (empty($data["id"])) {
            echo ResponseService::response(400, "Missing Id");
            return;
        }

        $id = $data["id"];

        $success = self::delete($connection, $id);
        if ($success) {
            echo ResponseService::response(200, "deleted");
        } else {
            echo ResponseService::response(500, "failed to delete");
        }
    }


    function updateHabit() {
        global $connection;

        $input = $_POST;
        if (empty($input)) {
            $input = json_decode(file_get_contents("php://input"), true);
        }

        $data = [];
        $id = $input["id"];

        if (!empty($input["habit_name"])) {
            $data["habit_name"] = $input["habit_name"];
        }
        if (!empty($input["unit"])) {
            $data["unit"] = $input["unit"];
        }
        if (!empty($input["value"])) {
            $data["value"] = $input["value"];
        }
        if (!empty($input["is_active"])) {
            $data["is_active"] = $input["is_active"];
        }

        if (empty($data)) {
            return ResponseService::response(400, "No fields to update");
        }

        $entry = Entry::find($connection, $id);
        $entry->update($connection, $data);
        $updatedHabit = Entry::find($connection, $id);


        return ResponseService::response(200, $updatedHabit->toArray());
    }
}
?>
