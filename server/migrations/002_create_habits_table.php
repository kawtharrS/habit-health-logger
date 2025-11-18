<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    habit_name VARCHAR(255) NOT NULL,
    unit VARCHAR(100) NOT NULL,
    target_value DECIMAL(6,2) DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB"; 

$query = $connection->prepare($sql);

if($query->execute()){
    echo "Table 'habits' created successfully!";
} else {
    echo "Error creating table: " . $connection->error;
}
?>
