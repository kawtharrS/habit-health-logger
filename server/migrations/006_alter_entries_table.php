<?php
include("../connection/connection.php");

$sql = "ALTER TABLE entries
    DROP COLUMN ai_response,
    ADD COLUMN top_habit VARCHAR(255) NULL,
    ADD COLUMN weak_habit VARCHAR(255) NULL,
    ADD COLUMN advice TEXT NULL,
    ADD COLUMN rating INT NULL;
";

$query = $connection->prepare($sql);
$query->execute();

echo "Table 'entries' created successfully!";
?>
