<?php
include(__DIR__ . '/../models/User.php');
include(__DIR__ . '/../connection/connection.php');
require_once(__DIR__ . '/../services/ResponseService.php');

class UserController
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

    private function fetchUserById($id): ?User
    {
        $user = User::find($this->connection, $id);
        if (!$user) {
            echo ResponseService::response(404, "User not found");
            return null;
        }
        return $user;
    }

    public function getUserById()
    {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo ResponseService::response(400, "ID is missing");
            return;
        }

        $user = $this->fetchUserById($id);
        if ($user) {
            echo ResponseService::response(200, $user->toArray());
        }
    }

    public function getAllUsers()
    {
        $users = User::findAll($this->connection);
        $usersArray = array_map(fn($user) => $user->toArray(), $users);
        echo ResponseService::response(200, $usersArray);
    }

    public function insertUser()
    {
        $input = $this->getInput();

        if (!isset($input["name"], $input["email"], $input["password"], $input["role"])) {
            echo ResponseService::response(400, "Missing required fields");
            return;
        }

        $input["password"] = password_hash($input["password"], PASSWORD_ARGON2I);
        $data = [
            'name' => $input["name"],
            'email' => $input["email"],
            'password' => $input["password"],
            'role' => $input["role"]
        ];

        $user = User::create($this->connection, $data);
        echo ResponseService::response(200, $user->toArray());
    }

    public function deleteUser()
    {
        $input = $this->getInput();
        $id = $input['id'] ?? null;

        if (!$id) {
            echo ResponseService::response(400, "Missing ID");
            return;
        }

        $user = $this->fetchUserById($id);
        if ($user) {
            $success = $user->delete($this->connection);
            echo ResponseService::response($success ? 200 : 500, $success ? "Deleted" : "Failed to delete");
        }
    }

    public function updateUser()
    {
        $input = $this->getInput();
        $id = $input['id'] ?? null;

        if (!$id) {
            echo ResponseService::response(400, "ID is required");
            return;
        }

        $user = $this->fetchUserById($id);
        if (!$user) return;

        $fields = ['name', 'email', 'password', 'role'];
        $data = [];

        foreach ($fields as $field) {
            if (!empty($input[$field])) {
                $data[$field] = $field === 'password'
                    ? password_hash($input[$field], PASSWORD_ARGON2I)
                    : $input[$field];
            }
        }

        if (empty($data)) {
            echo ResponseService::response(400, "No fields to update");
            return;
        }

        $user->update($this->connection, $data);
        $updatedUser = User::find($this->connection, $id);
        echo ResponseService::response(200, $updatedUser->toArray());
    }
}
?>
