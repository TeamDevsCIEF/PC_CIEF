<?php
// ./api/actualizar_estado/
include '../configs/cors.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405); // Método No Permitido
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido']);
    exit();
}

require '../configs/config.php'; 

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); 
    echo json_encode(['estado' => 'error', 'mensaje' => 'JSON inválido: ' . json_last_error_msg()]);
    exit();
}

$campos_requeridos = ['tarea_id', 'nuevo_estado'];
$datos_faltantes = [];

foreach ($campos_requeridos as $campo) {
    if (!isset($data[$campo]) || empty($data[$campo])) {
        $datos_faltantes[] = $campo;
    }
}

if (!empty($datos_faltantes)) {
    http_response_code(400); 
    echo json_encode([
        'estado' => 'error',
        'mensaje' => 'Datos incompletos: ' . implode(', ', $datos_faltantes)
    ]);
    exit();
}

$estados_validos = ['Pendiente', 'Ejecutando', 'Finalizado'];
if (!in_array($data['nuevo_estado'], $estados_validos)) {
    http_response_code(400);
    echo json_encode([
        'estado' => 'error',
        'mensaje' => 'Estado inválido. Valores permitidos: ' . implode(', ', $estados_validos)
    ]);
    exit();
}

$estado_json = json_encode($data);

try {
    $stmt = $pdo->prepare("CALL ActualizarEstadoTareaJSON(:estado_datos)");
    $stmt->bindParam(':estado_datos', $estado_json, PDO::PARAM_STR);
    $stmt->execute();

    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado && isset($resultado['resultado'])) {
        $respuesta = json_decode($resultado['resultado'], true);

        if ($respuesta) {
            echo json_encode($respuesta);
        } else {
            http_response_code(500); 
            echo json_encode([
                'estado' => 'error',
                'mensaje' => 'Error al decodificar la respuesta del servidor.'
            ]);
        }
    } else {
        http_response_code(500); 
        echo json_encode([
            'estado' => 'error',
            'mensaje' => 'No se pudo obtener una respuesta válida del servidor.'
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode([
        'estado' => 'error',
        'mensaje' => 'Error al actualizar el estado de la tarea: ' . $e->getMessage()
    ]);
}
?>
