<?php
include(__DIR__ . '/../models/Habit.php');
include(__DIR__ . '/../connection/connection.php');
require_once(__DIR__ . '/../services/ResponseService.php');

class HabitController
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

    private function fetchHabitById($id): ?Habit
    {
        $habit = Habit::find($this->connection, $id);
        if (!$habit) {
            echo ResponseService::response(404, "Habit not found");
            return null;
        }
        return $habit;
    }

    public function getHabitById()
    {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo ResponseService::response(400, "ID is missing");
            return;
        }

        $habit = $this->fetchHabitById($id);
        if ($habit) {
            echo ResponseService::response(200, $habit->toArray());
        }
    }

    public function getAllHabits()
    {
        $userId = $_GET['user_id'] ?? null;
        if (!$userId) {
            echo ResponseService::response(400, "user_id missing");
            return;
        }

        $habits = Habit::where($this->connection, ["user_id" => intval($userId)]);
        $habitsArr = array_map(fn($habit) => $habit->toArray(), $habits);

        echo ResponseService::response(200, $habitsArr);
    }

    public function insertHabit()
    {
        $input = $this->getInput();

        if (!isset($input["user_id"], $input["habit_name"], $input["unit"], $input["is_active"])) {
            echo ResponseService::response(400, "Missing required fields");
            return;
        }

        $data = [
            'user_id' => $input["user_id"],
            'habit_name' => $input["habit_name"],
            'unit' => $input["unit"],
            'target_value' => $input["target_value"] ?? null,
            'is_active' => $input["is_active"]
        ];

        $habit = Habit::create($this->connection, $data);
        echo ResponseService::response(200, $habit->toArray());
    }

    public function deleteHabit()
    {
        $input = $this->getInput();
        $id = $input['id'] ?? null;

        if (!$id) {
            echo ResponseService::response(400, "Missing ID");
            return;
        }

        $habit = $this->fetchHabitById($id);
        if ($habit) {
            $success = $habit->delete($this->connection);
            echo ResponseService::response($success ? 200 : 500, $success ? "Deleted" : "Failed to delete");
        }
    }

    public function updateHabit()
    {
        $input = $this->getInput();
        $id = $input['id'] ?? null;

        if (!$id) {
            echo ResponseService::response(400, "ID is required");
            return;
        }

        $habit = $this->fetchHabitById($id);
        if (!$habit) return;

        $fields = ['habit_name', 'unit', 'target_value', 'is_active'];
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

        $habit->update($this->connection, $data);
        $updatedHabit = Habit::find($this->connection, $id);
        echo ResponseService::response(200, $updatedHabit->toArray());
    }
}
?>
