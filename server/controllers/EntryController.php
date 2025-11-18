<?php 
include(__DIR__ . '/../models/Entry.php');
include(__DIR__ . '/../connection/connection.php');
require_once(__DIR__ . '/../services/ResponseService.php');

class EntryController{
    function getEntryById()
    {
        global $connection; 
        if(isset($_GET["id"]))
        {
            $id = $_GET["id"];
        }else{
            echo ResponseService::response(500, "ID is Missing");
            return;
        }

        $entry = Entry::find($connection, $id);
        echo ResponseService::response(200, $entry->toArray());
        return;
    }


    function getAllEntries()
    {
        global $connection;
        $entries = Entry::findAll($connection);
        $habitsArray=[];

        foreach($entries as $entry)
        {
            $habitsArray[]=$entry->toArray();
        }
        echo ResponseService::response(200, $habitsArray);
    }


    function insertEntry()
    {
        global $connection; 
        $input = $_POST;

        if(empty($input))
        {
            $input = json_decode(file_get_contents("php://input"), true);
        }
        if(!isset($input["user_id"], $input["raw_text"], $input["ai_response"]))
            return ResponseService::response(400, "Missing REquired Fields");

        $data = [
            'user_id' => $input["user_id"],
            'habit_id' => $input["habit_id"] ?? null,
            'raw_text' => $input["raw_text"],
            'ai_response' => $input["ai_response"] ?? null,
            'created_at' => $input["created_at"] ?? null  

        ];

        $entry = Entry::create($connection, $data);
        echo ResponseService::response(200, $entry->toArray());
    }

    function deleteEntry(){
        global $connection;
        $data = json_decode(file_get_contents("php://input"), true);
        if(empty($data["id"])){
            echo ResponseService::response(400, "Missing ID");
            return;
        }
        $id=$data["id"];
        $entry = Entry::find($connection, $id);
        $success = $entry->delete($connection);
        if($success){
            echo ResponseService::response(200, "deleted");
        }
        else{
            echo ResponseService::response(500, "failed");
        }
    }

   function updateEntry() {
        global $connection;

        $input = $_POST;

        if (empty($input)) {
            $input = json_decode(file_get_contents("php://input"), true);
        }

        $data = [];
        $id = $input["id"];

        if (!empty($input["raw_text"])) {
            $data["raw_text"] = $input["raw_text"];
        }


        if (empty($data)) {
            return ResponseService::response(400, "No fields");
        }
        $entry = Entry::find($connection, $id);
        $entry->update($connection, $data);
        $updatedEntry = Entry::find($connection, $id);

        return ResponseService::response(200, $updatedEntry->toArray());
    }

}
?>
