<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS habits(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        habit_name VARCHAR(255) NOT NULL,
        unit VARCHAR(100) NOT NULL,
        target_value DECIMAL(6,2) DEFAULT NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id))";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>