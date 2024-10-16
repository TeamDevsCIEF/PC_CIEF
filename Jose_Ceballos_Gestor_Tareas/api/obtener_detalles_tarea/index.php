<?php
// ./api/obtener_detalles_tarea/
header('Content-Type: application/json');
include '../configs/cors.php';
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); 
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido']);
    exit;
}

require '../configs/config.php';


if (!isset($_GET['id'])) {
    http_response_code(400); 
    echo json_encode(['estado' => 'error', 'mensaje' => 'Falta el parámetro id']);
    exit;
}

$tarea_id = intval($_GET['id']);

try {
    $stmt = $pdo->prepare("CALL ObtenerDetallesTareaJSON(:tarea_id)");
    $stmt->bindParam(':tarea_id', $tarea_id, PDO::PARAM_INT);
    $stmt->execute();

    $resultado = $stmt->fetch();
    if ($resultado) {
        echo json_encode(json_decode($resultado['resultado'], true));
    } else {
        http_response_code(404);
        echo json_encode(['estado' => 'error', 'mensaje' => 'Tarea no encontrada']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Error al obtener los detalles de la tarea']);
}
?>
