<?php
include("Model.php");

class Habit extends Model {
    private int $id;
    private int $user_id;
    private string $habit_name;
    private string $created_at;


    protected static string $table = "habits";

    public function __construct(array $data){
        $this->id = $data["id"];
        $this->user_id = $data["user_id"];
        $this->name = $data["habit_name"];
        $this->created_at=$data["created_at"];

    }

    public function getID(){
        return $this->id;
    }

    public function setUserId(int $user_id)
    {
        $this->user_id = $user_id;
    }
    public function getUSerId()
    {
        return $this->user_id;
    }

    public function setHabitName(string $habit_name){
        $this->habit_name = $habit_name;
    }

    public function getHabitName(){
        return $this->habit_name;
    }
    public function setCreatedAt(string $created_at)
    {
        $this->created_at = $created_at;
    }
    public function getCreatedAt(){
        return $this->created_at;
    }



    public function __toString(){
        return $this->id . " | " . $this->user_id . " | " .$this->habit_name . " | " . $this->created_at;
    }
    
    public function toArray(){
        return ["id" => $this->id, "user_id" =>$this->user_id ,"habit_name" => $this->habit_name, "created_at" => $this->created_at ];
    }

}

?>