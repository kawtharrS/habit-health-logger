<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS users(
          id INT(11) AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email TEXT NOT NULL,
          password VARCHAR(255) NOT NULL, 
          role VARCHAR(255) NOT NULL)";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>