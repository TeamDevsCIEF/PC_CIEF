<?php
// ./api/obtener_tareas/
header('Content-Type: application/json');
include '../configs/cors.php';
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); 
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido']);
    exit;
}

require '../configs/config.php';

try {
    $stmt = $pdo->prepare("CALL ObtenerTareasJSON()");
    $stmt->execute();

    $resultado = $stmt->fetch();
    echo json_encode(json_decode($resultado['resultado'], true));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Error al obtener las tareas']);
}
?>
