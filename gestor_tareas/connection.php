<?php

// Parámetros de la conexión
$serverName = "sql100.infinityfree.com";
$userName = "if0_37524230";
$password = "EvMsnCkAixj";
$dbName = "if0_37524230_gestor_tareas";

$link = "mysql:host=$serverName; port=3306; dbname=$dbName;";

try {
$conn = new PDO($link, $userName, $password);
//  echo "Connection established";

} catch (PDOException $e) {
    print("Error: " . $e->getMessage());
} catch (Exception $e) {
    print("Error: " . $e->getMessage());
}