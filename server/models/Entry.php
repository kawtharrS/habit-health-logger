<?php
include("Model.php");

class Entry extends Model {
    protected int $id;
    private int $user_id;
    private ?int $habit_id;
    private ?float $value;
    private string $raw_text;
    private string $ai_response;
    private ?string $created_at;
    private ?string $updated_at;

    protected static string $table = "entries";

    public function __construct(array $data){
        $this->id = $data["id"];
        $this->user_id = $data["user_id"];
        $this->habit_id = $data["habit_id"] ?? null;
        $this->value = isset($data["value"]) ? (float)$data["value"] : null;
        $this->raw_text = $data["raw_text"];
        $this->ai_response = $data["ai_response"] ?? null;
        $this->created_at = $data["created_at"];
        $this->updated_at = $data["updated_at"];
    }

    public function getID(): int {
        return $this->id;
    }

    public function getUserId(): int {
        return $this->user_id;
    }
    public function setUserId(int $user_id): void {
        $this->user_id = $user_id;
    }

    public function getHabitId(): ?int {
        return $this->habit_id;
    }
    public function setHabitId(?int $habit_id): void {
        $this->habit_id = $habit_id;
    }

    public function getValue(): ?float {
        return $this->value;
    }
    public function setValue(?float $value): void {
        $this->value = $value;
    }


    public function getRawText(): string {
        return $this->raw_text;
    }
    public function setRawText(string $raw_text): void {
        $this->raw_text = $raw_text;
    }

    public function getAiResponse(): ?string {
        return $this->ai_response;
    }
    public function setAiResponse(?string $ai_response): void {
        $this->ai_response = $ai_response;
    }

    public function getCreatedAt(): string {
        return $this->created_at;
    }

    public function getUpdatedAt(): string {
        return $this->updated_at;
    }

    public function __toString(): string {
        return $this->id . " | " . $this->user_id . " | " . $this->habit_id . " | " . $this->value . 
               " | "  . $this->raw_text . " | " . $this->ai_response;
    }

    public function toArray(): array {
        return [
            "id" => $this->id,
            "user_id" => $this->user_id,
            "habit_id" => $this->habit_id,
            "value" => $this->value,
            "raw_text" => $this->raw_text,
            "ai_response" => $this->ai_response,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at
        ];
    }
}
?>
