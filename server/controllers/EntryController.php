<?php
include(__DIR__ . '/../models/Entry.php');
include(__DIR__ . '/../connection/connection.php');
require_once(__DIR__ . '/../services/ResponseService.php');

class EntryController
{
    private mysqli $connection;

    public function __construct()
    {
        global $connection;
        $this->connection = $connection;
    }

    private function getInput(): array
    {
        $input = $_POST;
        if (empty($input)) {
            $input = json_decode(file_get_contents("php://input"), true);
        }
        return $input ?? [];
    }

    private function fetchEntryById($id): ?Entry
    {
        $entry = Entry::find($this->connection, $id);
        if (!$entry) {
            echo ResponseService::response(404, "Entry not found");
            return null;
        }
        return $entry;
    }

    public function getEntryById()
    {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo ResponseService::response(400, "ID is missing");
            return;
        }

        $entry = $this->fetchEntryById($id);
        if ($entry) {
            echo ResponseService::response(200, $entry->toArray());
        }
    }

    public function getAllEntries()
    {
        $userId = $_GET['user_id'] ?? null;
        if (!$userId) {
            echo ResponseService::response(400, "user_id missing");
            return;
        }

        $entries = Entry::where($this->connection, ["user_id" => intval($userId)]);
        $entriesArr = array_map(fn($entry) => $entry->toArray(), $entries);

        echo ResponseService::response(200, $entriesArr);
    }
    public function getEntries()
    {
        $entries = Entry::findAll($this->connection); 
        if ($entries) {
            $result = [];
            foreach ($entries as $entry) {
                $result[] = $entry->toArray();
            }
            echo ResponseService::response(200, $result); 
        } else {
            echo ResponseService::response(404, []);
        }
    }



    public function insertEntry()
    {
        $input = $this->getInput();

        if (!isset($input["user_id"], $input["raw_text"])) {
            echo ResponseService::response(400, "Missing required fields");
            return;
        }

        $data = [
            'user_id' => $input["user_id"],
            'habit_id' => $input["habit_id"] ?? null,
            'raw_text' => $input["raw_text"],
            'created_at' => $input["created_at"] ?? null,
            'top_habit' =>$input["top_habit"] ?? null,
            'weak_habit' => $input["weak_habit"] ?? null, 
            'advice' => $input["advice"] ?? null, 
            'rating' =>$input["rating"] ?? null
        ];

        $entry = Entry::create($this->connection, $data);
        echo ResponseService::response(200, $entry->toArray());
    }

    public function deleteEntry()
    {
        $input = $this->getInput();
        $id = $input['id'] ?? null;

        if (!$id) {
            echo ResponseService::response(400, "Missing ID");
            return;
        }

        $entry = $this->fetchEntryById($id);
        if ($entry) {
            $success = $entry->delete($this->connection);
            echo ResponseService::response($success ? 200 : 500, $success ? "Deleted" : "Failed to delete");
        }
    }

    public function updateEntry()
    {
        $input = $this->getInput();
        $id = $input['id'] ?? null;

        if (!$id) {
            echo ResponseService::response(400, "ID is required");
            return;
        }

        $entry = $this->fetchEntryById($id);
        if (!$entry) return;

        $fields = ['raw_text', 'habit_id', 'created_at', 'top_habit', 'weak_habit', 'advice', 'rating'];
        $data = [];

        foreach ($fields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }

        if (empty($data)) {
            echo ResponseService::response(400, "No fields to update");
            return;
        }

        $entry->update($this->connection, $data);
        $updatedEntry = Entry::find($this->connection, $id);

        echo ResponseService::response(200, $updatedEntry->toArray());
    }
}
?>
