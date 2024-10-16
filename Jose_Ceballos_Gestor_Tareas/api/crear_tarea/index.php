<?php
// ./api/crear_tarea/
include '../configs/cors.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); 
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido']);
    exit;
}

require '../configs/config.php';


$input = file_get_contents('php://input');
$data = json_decode($input, true);


if (
    !isset($data['titulo']) ||
    !isset($data['descripcion']) ||
    !isset($data['prioridad']) ||
    !isset($data['estado']) ||
    !isset($data['fecha_vencimiento'])
) {
    http_response_code(400); 
    echo json_encode(['estado' => 'error', 'mensaje' => 'Datos incompletos']);
    exit;
}

$tarea_json = json_encode($data);

try {
    $stmt = $pdo->prepare("CALL InsertarTareaJSON(:tarea_datos)");
    $stmt->bindParam(':tarea_datos', $tarea_json, PDO::PARAM_STR);
    $stmt->execute();

    $resultado = $stmt->fetch();
    echo json_encode(json_decode($resultado['resultado'], true));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Error al crear la tarea']);
}
?>
