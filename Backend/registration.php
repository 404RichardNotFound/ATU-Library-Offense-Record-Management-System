<?php
// ✅ CORS FIX: Allow requests from React Frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// ✅ Handle Preflight Requests (OPTIONS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// ✅ Include Database Connection
include 'db.php';

// ✅ Read JSON Data from Request
$data = json_decode(file_get_contents("php://input"), true);

// ✅ Validate Required Fields
if (
    isset($data["name"]) &&
    isset($data["studentID"]) &&
    isset($data["email"]) &&
    isset($data["password"]) &&
    isset($data["phoneNumber"]) &&
    isset($data["gender"]) &&
    isset($data["programme"])
) {
    // ✅ Sanitize Input Data
    $name = mysqli_real_escape_string($conn, $data["name"]);
    $studentID = mysqli_real_escape_string($conn, $data["studentID"]);
    $email = mysqli_real_escape_string($conn, $data["email"]);
    $phoneNumber = mysqli_real_escape_string($conn, $data["phoneNumber"]);
    $gender = mysqli_real_escape_string($conn, $data["gender"]);
    $programme = mysqli_real_escape_string($conn, $data["programme"]);

    // ✅ Hash Password Before Storing in Database
    $hashedPassword = password_hash($data["password"], PASSWORD_DEFAULT);

    // ✅ Insert Data into Database
    $sql = "INSERT INTO students (name, studentID, email, password, phoneNumber, gender, programme) 
            VALUES ('$name', '$studentID', '$email', '$hashedPassword', '$phoneNumber', '$gender', '$programme')";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "message" => "Registration successful!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
}

// ✅ Close Database Connection
$conn->close();
?>
