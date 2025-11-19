<?php
include("Model.php");

class Entry extends Model {
    protected int $id;
    private int $user_id;
    private ?int $habit_id;
    private string $raw_text;
    private ?string $created_at;
    private ?string $updated_at;
    private ?string $top_habit;
    private ?string $weak_habit;
    private ?string $advice;
    private ?int $rating;

    protected static string $table = "entries";

    public function __construct(array $data){
        $this->id = $data["id"];
        $this->user_id = $data["user_id"];
        $this->habit_id = $data["habit_id"] ?? null;
        $this->raw_text = $data["raw_text"];
        $this->created_at = $data['created_at'] ?? null;
        $this->updated_at = $data['updated_at'] ?? null;
        $this->top_habit = $data['top_habit'] ?? null;
        $this->weak_habit = $data['weak_habit'] ?? null;
        $this->advice = $data['advice'] ?? null;
        $this->rating = $data['rating'] ?? null;
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

    public function getRawText(): string {
        return $this->raw_text;
    }
    public function setRawText(string $raw_text): void {
        $this->raw_text = $raw_text;
    }

    public function getTopHabit(): ?string {
        return $this->top_habit;
    }
    public function setTopHabit(?string $top_habit): void {
        $this->top_habit = $top_habit;
    }

    public function getWeakHabit(): ?string {
        return $this->weak_habit;
    }
    public function setWeakHabit(?string $weak_habit): void {
        $this->weak_habit = $weak_habit;
    }

    public function getAdvice(): ?string {
        return $this->advice;
    }
    public function setAdvice(?string $advice): void {
        $this->advice = $advice;
    }

    public function getRating(): ?int {
        return $this->rating;
    }
    public function setRating(?int $rating): void {
        $this->rating = $rating;
    }

    public function getCreatedAt(): ?string {
        return $this->created_at;
    }
    public function getUpdatedAt(): ?string {
        return $this->updated_at;
    }

    public function __toString(): string {
        return $this->id . " | " . $this->user_id . " | " . $this->habit_id . " | " 
            . $this->raw_text . " | " 
            . $this->top_habit . " | " . $this->weak_habit . " | " 
            . $this->advice . " | " . $this->rating;
    }

    public function toArray(): array {
        return [
            "id" => $this->id,
            "user_id" => $this->user_id,
            "habit_id" => $this->habit_id,
            "raw_text" => $this->raw_text,
            "top_habit" => $this->top_habit,
            "weak_habit" => $this->weak_habit,
            "advice" => $this->advice,
            "rating" => $this->rating,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at
        ];
    }
}
?>
