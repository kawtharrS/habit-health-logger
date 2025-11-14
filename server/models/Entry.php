<?php
include("Model.php");

class Habit extends Model {
    private int $id;
    private int $user_id;
    private int $habit_id;
    private string $value;
    private string $created_at;
    private string $raw_text;
    private string $response;



    protected static string $table = "entries";

    public function __construct(array $data){
        $this->id = $data["id"];
        $this->user_id = $data["user_id"];
        $this->habit_id = $data["habit_id"];
        $this->value= $data["value"];
        $this->created_at=$data["created_at"];
        $this->raw_text=$data["raw_text"];
        $this->response=$data["response"];
    }

    public function getID(){
        return $this->id;
    }

    public function setUserId(int $user_id)
    {
        $this->user_id = $user_id;
    }
    public function getUserId()
    {
        return $this->user_id;
    }

    public function setHabitId(int $habit_id)
    {
        $this->habit_id = $habit_id;
    }
    public function getHabitId()
    {
        return $this->habit_id;
    }

    public function setValue(int $value)
    {
        $this->value = $value;
    }
    public function getValue()
    {
        return $this->value;
    }
    public function setCreatedAt(string $created_at)
    {
        $this->create_at = $created_at;
    }
    public function getCreatedAt(){
        return $this->created_at;
    }
    public function setRawText(string $raw_text)
    {
        $this->raw_text = $raw_text;
    }
    public function getRawText(){
        return $this->raw_text;
    }
    public function setResponse(string $response)
    {
        $this->response = $response;
    }
    public function getResponse(){
        return $this->response;
    }


    public function __toString(){
        return $this->id . " | " . $this->user_id . " | " . $this->habit_id. " | " .$this->value . " | " .$this->created_at  . " | " . $this->raw_text  . " | " .$this->response;
    }
    
    public function toArray(){
        return ["id" => $this->id, "user_id" =>$this->user_id ,"habit_id" =>$this->habit_id, "value"=>$this->value,  "created_at" => $this->created_at, "raw-text"=>$this->raw_text, "response"=>$this->response ];
    }

}

?>