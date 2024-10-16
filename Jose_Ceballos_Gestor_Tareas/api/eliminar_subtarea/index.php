<?php
include '../configs/cors.php';
header('Content-Type: application/json');
require '../configs/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido']);
    exit;
}

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['subtarea_id'])) {
        http_response_code(400);
        echo json_encode(['estado' => 'error', 'mensaje' => 'Datos incompletos']);
        exit;
    }

    $subtarea_json = json_encode($data);

    $stmt = $pdo->prepare("CALL EliminarSubTareaJSON(:subtarea_datos)");
    $stmt->bindParam(':subtarea_datos', $subtarea_json, PDO::PARAM_STR);
    $stmt->execute();

    $resultado = $stmt->fetch();
    echo json_encode(json_decode($resultado['resultado'], true));

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['estado' => 'error', 'mensaje' => 'Error al eliminar la sub-tarea', 'error' => $e->getMessage()]);
}
?>
