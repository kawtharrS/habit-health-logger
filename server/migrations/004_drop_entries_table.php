<?php
include("../connection/connection.php");

$sql = "DROP TABLE entries;";

$query = $connection->prepare($sql);
$query->execute();

echo "Table 'entries' created successfully!";
?>
