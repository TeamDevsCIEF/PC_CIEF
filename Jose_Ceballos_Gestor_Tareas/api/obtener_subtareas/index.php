<?php
// ./api/obtener_subtareas/
include '../configs/cors.php';
header('Content-Type: application/json');
require '../configs/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); 
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido']);
    exit;
}

try {
    if (!isset($_GET['tarea_id'])) {
        http_response_code(400); 
        echo json_encode(['estado' => 'error', 'mensaje' => 'Datos incompletos']);
        exit;
    }

    $tarea_id = $_GET['tarea_id'];

    $stmt = $pdo->prepare("CALL ObtenerSubTareasPorTareaJSON(:tarea_id)");
    $stmt->bindParam(':tarea_id', $tarea_id, PDO::PARAM_INT);
    $stmt->execute();

    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['resultado' => json_decode($resultado['resultado'], true)]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Error al obtener las sub-tareas', 'error' => $e->getMessage()]);
}
?>
