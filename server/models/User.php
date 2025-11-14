<?php
include("Model.php");

class USer extends Model {
    private int $id;
    private string $name;
    private string $email;
    private string $password;
    private string $role;

    protected static string $table = "users";

    public function __construct(array $data){
        $this->id = $data["id"];
        $this->name = $data["name"];
        $this->email = $data["email"];
        $this->password = $data["password"];
        $this->role = $data["role"];
    }

    public function getID(){
        return $this->id;
    }

    public function setName(string $name){
        $this->name = $name;
    }

    public function getName(){
        return $this->name;
    }

    public function setEmail(string $email){
        $this->email = $email;
    }

    public function getEmail(){
        return $this->email;
    }

    public function setPassword(string $password){
        $this->password =$password;
    }

    public function getPassword(){
        return $this->password;
    }

    public function setRole(string $role)
    {
        return $this->$role;
    }
    public function getRole()
    {
        return $this->role;
    }


    public function __toString(){
        return $this->id . " | " . $this->name . " | " . $this->email. " | " . $this->password . " | " .$this->role;
    }
    
    public function toArray(){
        return ["id" => $this->id, "name" => $this->name, "email" => $this->email, "password" => $this->password, "role" => $this->role];
    }

}

?>