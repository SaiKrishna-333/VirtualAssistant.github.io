<?php
// Set headers for JSON response and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  // Allow any origin, modify for more security

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check if 'action' is set and handle it
    if (isset($_GET['action'])) 
    {
        if ($_GET['action'] === 'getTime') 
        {
            // Return current time in 'H:i:s' format
            echo json_encode(array('time' => date('H:i:s')));
        } 
        elseif ($_GET['action'] === 'getDate') 
        {
            // Return today's date in 'Y-m-d' format
            echo json_encode(array('date' => date('Y-m-d')));
        } 
        else 
        {
            // If action is not recognized, return a default message
            echo json_encode(array('message' => 'Action not recognized.'));
        }
    } 
    else 
    {
        // If no action parameter is passed, return a default welcome message
        echo json_encode(array('message' => 'Welcome to Viras, your virtual assistant.'));
    }
} 
else
{
    // If the request is not a GET request, return an error message
    echo json_encode(array('message' => 'Invalid request.'));
}
?>

