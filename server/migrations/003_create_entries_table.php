<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS entries(
          id INT(11) AUTO_INCREMENT PRIMARY KEY,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (habit_id) REFERENCES habits(id),
          value VARCHAR(255) NOT NULL,
          create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          raw_text TEXT NOT NULL,
          response TEXT NOT NULL)";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>