<?php

$host = 'sql100.infinityfree.com';       
$db   = 'if0_37524230_gestor_tareas';   
$user = 'if0_37524230';      
$pass = "EvMsnCkAixj";   
$charset = 'utf8mb4';

$link = "mysql:host=$host;dbname=$db;charset=$charset";

try {
    
    $pdo = new PDO($link, $user, $pass);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Error de conexión a la base de datos']);
    exit;
}
?>
