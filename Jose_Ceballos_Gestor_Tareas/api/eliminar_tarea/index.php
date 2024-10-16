<?php
// ./api/eliminar_tarea/
header('Content-Type: application/json');
include '../configs/cors.php';
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); 
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido']);
    exit;
}

require '../configs/config.php';


$input = file_get_contents('php://input');
$data = json_decode($input, true);


if (
    !isset($data['tarea_id'])
) {
    http_response_code(400); 
    echo json_encode(['estado' => 'error', 'mensaje' => 'Datos incompletos']);
    exit;
}

$tarea_json = json_encode($data);

try {
    $stmt = $pdo->prepare("CALL EliminarTareaJSON(:tarea_datos)");
    $stmt->bindParam(':tarea_datos', $tarea_json, PDO::PARAM_STR);
    $stmt->execute();

    $resultado = $stmt->fetch();
    echo json_encode(json_decode($resultado['resultado'], true));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Error al eliminar la tarea']);
}
?>
