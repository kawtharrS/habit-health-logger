<?php
include("Model.php");

class Habit extends Model {
    private int $id;
    private int $user_id;
    private string $habit_name;
    private string $unit;
    private ?float $target_value;
    private int $is_active;
    private string $created_at;


    protected static string $table = "habits";

    public function __construct(array $data){
        $this->id = $data["id"];
        $this->user_id = $data["user_id"];
        $this->habit_name = $data["habit_name"];
        $this->unit = $data["unit"];
        $this->target_value=$data["target_value"];
        $this->is_active=$data["is_active"];
        $this->created_at = $data["created_at"] ?? date('Y-m-d H:i:s');

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

    public function setUnit(string $unit)
    {
        $this->unit = $unit;
    }
    public function getUnit()
    {
        return $this->unit;
    }

    public function setTargetValue(float $target_value){
        $this->target_value = $target_value;
    }
    public function getTargetValue(){
        return $this->target_value;
    }

    public function setIsActive(int $is_active){
        $this->is_active=$is_active;
    }
    public function getIsActive(){
        return $this->is_active;
    }

    public function setCreatedAt(string $created_at)
    {
        $this->created_at = $created_at;
    }
    public function getCreatedAt(){
        return $this->created_at;
    }



    public function __toString(): string {
        return $this->id . " | " 
            . $this->user_id . " | " 
            . $this->habit_name . " | " 
            . $this->unit . " | " 
            . ($this->target_value ?? 'NULL') . " | " 
            . $this->is_active . " | " 
            . $this->created_at;
    }

    public function toArray(): array {
        return [
            "id" => $this->id,
            "user_id" => $this->user_id,
            "habit_name" => $this->habit_name,
            "unit" => $this->unit,
            "target_value" => $this->target_value,
            "is_active" => $this->is_active,
            "created_at" => $this->created_at
        ];
    }

}

?>