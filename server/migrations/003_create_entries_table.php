<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    habit_id INT NULL,
    entry_date DATE NOT NULL,
    value DECIMAL(10,2) DEFAULT NULL,
    raw_text TEXT NOT NULL,
    ai_respone TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_date_habit (user_id, habit_id, entry_date)
);";

$query = $connection->prepare($sql);
$query->execute();

echo "Table 'entries' created successfully!";
?>
