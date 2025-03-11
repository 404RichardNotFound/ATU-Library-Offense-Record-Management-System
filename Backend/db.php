<?php
// Database connection parameters
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "atu_lorms";

// Create a new MySQLi connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check the connection
if ($conn->connect_error) {
    // If connection fails, output the error and terminate the script
    die("Connection failed: " . $conn->connect_error);
}

// Connection successful
?>
