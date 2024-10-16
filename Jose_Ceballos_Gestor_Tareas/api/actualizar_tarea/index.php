<?php
// ./api/actualizar_tarea/

include '../configs/cors.php';
header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405); 
    echo json_encode(['estado' => 'error', 'mensaje' => 'Método no permitido']);
    exit;
}

require '../configs/config.php'; 


$input = file_get_contents('php://input');
$data = json_decode($input, true);


if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); 
    echo json_encode(['estado' => 'error', 'mensaje' => 'JSON inválido: ' . json_last_error_msg()]);
    exit;
}


$campos_requeridos = ['tarea_id', 'titulo', 'descripcion', 'prioridad', 'estado', 'fecha_vencimiento'];
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
    exit;
}


$prioridades_validas = ['Urgente', 'Alta', 'Media', 'Baja'];
$estados_validos = ['Pendiente', 'Ejecutando', 'Finalizado', 'Eliminada'];

if (!in_array($data['prioridad'], $prioridades_validas)) {
    http_response_code(400);
    echo json_encode([
        'estado' => 'error',
        'mensaje' => 'Prioridad inválida. Valores permitidos: ' . implode(', ', $prioridades_validas)
    ]);
    exit;
}

if (!in_array($data['estado'], $estados_validos)) {
    http_response_code(400);
    echo json_encode([
        'estado' => 'error',
        'mensaje' => 'Estado inválido. Valores permitidos: ' . implode(', ', $estados_validos)
    ]);
    exit;
}


$tarea_json = json_encode($data);

try {
    
    $stmt = $pdo->prepare("CALL ActualizarTareaJSON(:tarea_datos)");
    $stmt->bindParam(':tarea_datos', $tarea_json, PDO::PARAM_STR);
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
        'mensaje' => 'Error al actualizar la tarea: ' . $e->getMessage()
    ]);
}
?>
