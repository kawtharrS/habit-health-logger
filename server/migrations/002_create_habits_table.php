<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS habits(
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        FOREIGN KEY (user_id) REFERENCES users(id),
        habit_name VARCHAR(255) NOT NULL,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>