<?php
// ./index.php
include './api/configs/cors.php';

header('Content-Type: text/html; charset=utf-8');

function callAPI($method, $url, $data = null)
{
    $curl = curl_init();

    $headers = ['Content-Type: application/json'];
    if ($method === "GET" && is_array($data)) {
        $url = sprintf("%s?%s", $url, http_build_query($data));
    } else {
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        if (is_array($data)) {
            curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
            $headers[] = 'Content-Encoding: gzip';
        }
    }

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_ENCODING, 'gzip');
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

    $result = curl_exec($curl);

    if ($result === false) {
        echo 'Error en cURL: ' . curl_error($curl);
        curl_close($curl);
        return [];
    }

    curl_close($curl);

    $decodedResult = json_decode($result, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "Error al decodificar JSON: " . json_last_error_msg();
        echo "<pre>Respuesta de la API:\n" . htmlspecialchars($result) . "</pre>";
        return [];
    }

    return $decodedResult ?: [];
}

$baseURL = 'http://localhost/Jose_Ceballos_Gestor_Tareas/api/'; 

$tareas_response = callAPI("GET", $baseURL . "obtener_tareas/index.php");
$tareas = [];
if (isset($tareas_response['resultado']) && is_array($tareas_response['resultado'])) {
    $tareas = $tareas_response['resultado'];
} elseif (is_array($tareas_response)) {
    $tareas = $tareas_response;
} else {
    $tareas = [];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'crear') {
        $titulo = $_POST['titulo'];
        $descripcion = $_POST['descripcion'];
        $prioridad = $_POST['prioridad'] ?? 'Media'; 
        $estado = "Pendiente";
        $vencimiento = $_POST['vencimiento'];
        
        $nuevaTarea = [
            "titulo" => $titulo,
            "descripcion" => $descripcion,
            "prioridad" => $prioridad,
            "estado" => $estado,
            "fecha_vencimiento" => $vencimiento
        ];
        
        $response = callAPI("POST", $baseURL . 'crear_tarea/index.php', $nuevaTarea);

        if (isset($response['tarea_id'])) {
            $tarea_id = $response['tarea_id'];
            
            if (isset($_POST['subtareas_nuevas'])) {
                foreach ($_POST['subtareas_nuevas'] as $subtitulo) {
                    $subtitulo = trim($subtitulo);
                    if (!empty($subtitulo)) {
                        $nuevaSubTarea = [
                            "tarea_id" => $tarea_id,
                            "titulo" => $subtitulo,
                            "descripcion" => "",
                            "estado" => "Pendiente"
                        ];
                        callAPI("POST", $baseURL . 'crear_subtarea/index.php', $nuevaSubTarea);
                    }
                }
            }
        }

        header("Location: index.php");
        exit();
    } elseif ($_POST['action'] === 'eliminar') {
        $tarea_id = $_POST['tarea_id'];
        callAPI("DELETE", $baseURL . 'eliminar_tarea/index.php', ["tarea_id" => $tarea_id]);
        header("Location: index.php");
        exit();
    } elseif ($_POST['action'] === 'editar') {
        $tarea_id = $_POST['tarea_id'];
        $titulo = $_POST['titulo'];
        $descripcion = $_POST['descripcion'];
        $prioridad = $_POST['prioridad'];
        $estado = $_POST['estado'];
        $vencimiento = $_POST['vencimiento'];
        
        $tareaActualizada = [
            "tarea_id" => $tarea_id,
            "titulo" => $titulo,
            "descripcion" => $descripcion,
            "prioridad" => $prioridad,
            "estado" => $estado,
            "fecha_vencimiento" => $vencimiento
        ];

        callAPI("PUT", $baseURL . 'actualizar_tarea/index.php', $tareaActualizada);
        
        if (isset($_POST['subtareas_existentes'])) {
            foreach ($_POST['subtareas_existentes'] as $subtarea_id => $subtitulo) {
                $subtitulo = trim($subtitulo);
                if (!empty($subtitulo)) {
                    $subtareaActualizada = [
                        "subtarea_id" => $subtarea_id,
                        "titulo" => $subtitulo,
                        "estado" => "Pendiente" 
                    ];
                    callAPI("PUT", $baseURL . 'actualizar_subtarea/index.php', $subtareaActualizada);
                }
            }
        }
        
        if (isset($_POST['subtareas_nuevas'])) {
            foreach ($_POST['subtareas_nuevas'] as $subtitulo) {
                $subtitulo = trim($subtitulo);
                if (!empty($subtitulo)) {
                    $nuevaSubTarea = [
                        "tarea_id" => $tarea_id,
                        "titulo" => $subtitulo,
                        "descripcion" => "",
                        "estado" => "Pendiente"
                    ];
                    callAPI("POST", $baseURL . 'crear_subtarea/index.php', $nuevaSubTarea);
                }
            }
        }

        header("Location: index.php");
        exit();
    }
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Gestor de Tareas</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Gestor de Tareas - Organiza y administra tus tareas de manera eficiente.">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/styles.css">
    <style>
        .priority-badge {
            position: absolute;
            top: -8px;
            right: -5px;
        }

        .card {
            position: relative;
        }

        .card-header.bg-primary {
            background-color: #0d6efd !important;
            color: #fff !important;
        }

        .card-header.bg-warning {
            background-color: #ffc107 !important;
            color: #212529 !important;
        }

        .card-header.bg-success {
            background-color: #198754 !important;
            color: #fff !important;
        }

        .card-header.bg-secondary {
            background-color: #6c757d !important;
            color: #fff !important;
        }

        .badge.bg-danger {
            background-color: #dc3545 !important;
        }

        .badge.bg-warning {
            background-color: #ffc107 !important;
            color: #212529 !important;
        }

        .badge.bg-info {
            background-color: #0dcaf0 !important;
            color: #212529 !important;
        }

        .badge.bg-secondary {
            background-color: #6c757d !important;
        }

        .card-NoN-Props {
            border: none;
            --bs-card-spacer-x: 0;
            --bs-card-bg: none;
            box-shadow: none !important;
        }

        .card-header:first-child {
            border-radius: 15px;
        }
        .subtarea-checkbox {
            width: 1.2em;
            height: 1.2em;
            border-radius: 50%;
            border: 2px solid #6c757d;
            transition: background-color 0.3s, border-color 0.3s;
            cursor: pointer;
        }
        .subtarea-checkbox:focus {
            outline: 2px solid #0d6efd;
            outline-offset: 2px;
        }

        .subtarea-checkbox:checked {
            background-color: #198754;
            border-color: #198754;
        }

        .subtarea-checkbox:hover {
            border-color: #0d6efd;
        }

        .text-decoration-line-through {
            text-decoration: line-through;
        }

        .agregar-subtarea-btn {
            font-size: 0.9em;
        }

        .card-eliminada {
            position: relative;
            padding-bottom: 60px;
        }

        .card-eliminada .recuperar-btn {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
        }
        button,
        input,
        select,
        textarea {
            font-size: 1rem;
        }

        [role="button"] {
            cursor: pointer;
        }

        .btn-close {
            color: #000;
        }
        a:focus,
        button:focus,
        input:focus,
        select:focus,
        textarea:focus {
            outline: 2px solid #0d6efd;
            outline-offset: 2px;
        }
        .visually-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    </style>
</head>

<body>
<header>
    </header>
    <main>
    <div class="container my-5">
        <h1 class="text-center mb-4">Gestor de Tareas</h1>
        <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#crearTareaModal" aria-label="Añadir Tarea">
        <i class="bi bi-plus-lg" aria-hidden="true"></i> Añadir Tarea
        </button>
        </div>

        <div class="modal fade" id="crearTareaModal" tabindex="-1" aria-labelledby="crearTareaModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <form method="POST" action="" id="crearTareaForm">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h2 class="modal-title fs-5" id="crearTareaModalLabel">Crear Nueva Tarea</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" name="action" value="crear">
                            <div class="mb-3">
                                <label for="titulo" class="form-label">Título:</label>
                                <input type="text" name="titulo" id="titulo" class="form-control" required aria-required="true">
                            </div>
                            <div class="mb-3">
                                <label for="descripcion" class="form-label">Descripción:</label>
                                <textarea name="descripcion" id="descripcion" class="form-control" required aria-required="true"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="prioridad" class="form-label">Prioridad:</label>
                                <select name="prioridad" id="prioridad" class="form-select" required aria-required="true">
                                    <option value="Urgente">Urgente</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Media" selected>Media</option>
                                    <option value="Baja">Baja</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="vencimiento" class="form-label">Vencimiento:</label>
                                <input type="date" name="vencimiento" id="vencimiento" class="form-control" required aria-required="true">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Sub-Tareas:</label>
                                <div id="subtareas-container-crear">
                                </div>
                                <button type="button" class="btn btn-sm btn-outline-secondary mt-2" id="agregarSubtareaBtnCrear" aria-label="Agregar Sub-Tarea">
                                <i class="bi bi-plus-circle" aria-hidden="true"></i> Agregar Sub-Tarea
                                </button>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary">Crear</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="modal fade" id="editarTareaModal" tabindex="-1" aria-labelledby="editarTareaModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <form method="POST" action="" id="editarTareaForm">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h2 class="modal-title fs-5" id="editarTareaModalLabel">Editar Tarea</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" name="action" value="editar">
                            <input type="hidden" name="tarea_id" id="edit_tarea_id">
                            <div class="mb-3">
                                <label for="edit_titulo" class="form-label">Título:</label>
                                <input type="text" name="titulo" id="edit_titulo" class="form-control" required aria-required="true">
                                </div>
                            <div class="mb-3">
                                <label for="edit_descripcion" class="form-label">Descripción:</label>
                                <textarea name="descripcion" id="edit_descripcion" class="form-control" required aria-required="true"></textarea>
                                </div>
                            <div class="mb-3">
                                <label for="edit_prioridad" class="form-label">Prioridad:</label>
                                <select name="prioridad" id="edit_prioridad" class="form-select" required aria-required="true">
                                <option value="Urgente">Urgente</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Media">Media</option>
                                    <option value="Baja">Baja</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="edit_estado" class="form-label">Estado:</label>
                                <select name="estado" id="edit_estado" class="form-select" required aria-required="true">
                                <option value="Pendiente">Pendiente</option>
                                    <option value="Ejecutando">Ejecutando</option>
                                    <option value="Finalizado">Finalizado</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="edit_vencimiento" class="form-label">Vencimiento:</label>
                                <input type="date" name="vencimiento" id="edit_vencimiento" class="form-control" required aria-required="true">
                                </div>
                            <div class="mb-3">
                                <label class="form-label">Sub-Tareas:</label>
                                <div id="subtareas-container-editar">
                                </div>
                                <button type="button" class="btn btn-sm btn-outline-secondary mt-2" id="agregarSubtareaBtnEditar" aria-label="Agregar Sub-Tarea">
                                        <i class="bi bi-plus-circle" aria-hidden="true"></i> Agregar Sub-Tarea
                                </button>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="modal fade" id="eliminarTareaModal" tabindex="-1" aria-labelledby="eliminarTareaModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <form method="POST" action="">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h2 class="modal-title fs-5" id="eliminarTareaModalLabel">Eliminar Tarea</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" name="action" value="eliminar">
                            <input type="hidden" name="tarea_id" id="delete_tarea_id">
                            <p>¿Estás seguro de que deseas eliminar esta tarea?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-danger">Eliminar</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="modal fade" id="actualizarEstadoModal" tabindex="-1" aria-labelledby="actualizarEstadoModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <form id="actualizarEstadoForm">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h2 class="modal-title fs-5" id="actualizarEstadoModalLabel">Actualizar Estado de Tarea</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" name="tarea_id" id="estado_tarea_id">
                            <input type="hidden" name="nuevo_estado" id="nuevo_estado">
                            <p>Selecciona el nuevo estado para la tarea:</p>
                            <div class="d-flex justify-content-around">
                            <button type="button" class="btn btn-outline-primary estado-btn" data-estado="Pendiente" aria-pressed="false">
                            <i class="bi bi-hourglass-split" aria-hidden="true"></i> Pendiente
                                </button>
                                <button type="button" class="btn btn-outline-warning estado-btn" data-estado="Ejecutando" aria-pressed="false">
                                        <i class="bi bi-play-circle" aria-hidden="true"></i> Ejecutando
                                </button>
                                <button type="button" class="btn btn-outline-success estado-btn" data-estado="Finalizado" aria-pressed="false">
                                        <i class="bi bi-check-circle" aria-hidden="true"></i> Finalizado
                                </button>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary">Actualizar Estado</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal para Agregar Sub-Tarea desde la Tarjeta de la Tarea -->
        <div class="modal fade" id="agregarSubtareaModal" tabindex="-1" aria-labelledby="agregarSubtareaModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <form id="agregarSubtareaForm">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h2 class="modal-title fs-5" id="agregarSubtareaModalLabel">Agregar Sub-Tarea</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="nueva_subtarea_titulo" class="form-label">Título de la Sub-Tarea:</label>
                                <input type="text" class="form-control" id="nueva_subtarea_titulo" name="titulo" required aria-required="true">
                                </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary">Agregar</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal de Confirmación de Eliminación de Sub-Tarea -->
        <div class="modal fade" id="eliminarSubtareaModal" tabindex="-1" aria-labelledby="eliminarSubtareaModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <form id="eliminarSubtareaForm">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h2 class="modal-title fs-5" id="eliminarSubtareaModalLabel">Eliminar Sub-Tarea</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div class="modal-body">
                            <p>¿Estás seguro de que deseas eliminar esta sub-tarea?</p>
                            <input type="hidden" id="delete_subtarea_id">
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-danger">Eliminar</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="modal fade" id="confirmarRecuperacionModal" tabindex="-1" aria-labelledby="confirmarRecuperacionModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <form id="confirmarRecuperacionForm">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h2 class="modal-title fs-5" id="confirmarRecuperacionModalLabel">Recuperar Tarea</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div class="modal-body">
                            <p>¿Estás seguro de que deseas recuperar esta tarea?</p>
                            <input type="hidden" id="recuperar_tarea_id">
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-success">Recuperar</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="row g-4">
            <?php  
            function renderColumna($tareas, $estadoColumna)
            {
                $filteredTareas = array_filter($tareas, function ($tarea) use ($estadoColumna) {
                    return $tarea['estado'] === $estadoColumna;
                });

                if (count($filteredTareas) === 0) {
                    return; 
                }
                usort($filteredTareas, function($a, $b) {
                    $fechaA = strtotime($a['fecha_creacion']);
                    $fechaB = strtotime($b['fecha_creacion']);
                    return $fechaB - $fechaA;
                });

                switch ($estadoColumna) {
                    case 'Pendiente':
                        $colColor = 'primary';
                        break;
                    case 'Ejecutando':
                        $colColor = 'warning';
                        break;
                    case 'Finalizado':
                        $colColor = 'success';
                        break;
                    case 'Eliminada':
                        $colColor = 'secondary';
                        break;
                    default:
                        $colColor = 'secondary';
                }

                echo '<div class="col-lg-3 col-md-4 col-sm-6">';
                echo '<div class="card h-100 shadow-sm card-NoN-Props" role="region" aria-labelledby="' . strtolower($estadoColumna) . '-heading">';
                    echo '<div class="card-header bg-' . $colColor . ' text-white" id="' . strtolower($estadoColumna) . '-heading">' . htmlspecialchars($estadoColumna) . '</div>';
                echo '<div class="card-body">';
                echo '<h3 class="visually-hidden">' . htmlspecialchars($estadoColumna) . '</h3>'; // Encabezado oculto para accesibilidad

                foreach ($filteredTareas as $tarea) {
                    
                    $fecha_creacion = date('d/m/Y', strtotime($tarea['fecha_creacion']));
                    $fecha_vencimiento = date('d/m/Y', strtotime($tarea['fecha_vencimiento']));
                    $fecha_eliminacion = isset($tarea['fecha_eliminacion']) ? date('d/m/Y H:i:s', strtotime($tarea['fecha_eliminacion'])) : null;
            
                    switch ($tarea['prioridad']) {
                        case 'Urgente':
                            $badgeColor = 'danger';
                            break;
                        case 'Alta':
                            $badgeColor = 'warning';
                            break;
                        case 'Media':
                            $badgeColor = 'info';
                            break;
                        case 'Baja':
                            $badgeColor = 'secondary';
                            break;
                        default:
                            $badgeColor = 'secondary';
                    }

                    if ($estadoColumna === 'Eliminada') {
                        
                        $fechaEliminacionTimestamp = strtotime($tarea['fecha_eliminacion']);
                        $timeToDestroy = intval($tarea['time_to_destroy']);
                        $now = time();
                        $remainingSeconds = ($fechaEliminacionTimestamp + $timeToDestroy) - $now;
                        if ($remainingSeconds > 0) {
                            $minutes = floor($remainingSeconds / 60);
                            $seconds = $remainingSeconds % 60;
                            $remainingTimeFormatted = sprintf('%02d:%02d', $minutes, $seconds);
                        } else {
                            $remainingTimeFormatted = '00:00';
                            $remainingSeconds = 0;
                        }

                        echo '<div class="card mb-3 position-relative card-eliminada">';                        
                        echo '<span class="badge bg-' . $badgeColor . ' priority-badge">' . htmlspecialchars($tarea['prioridad']) . '</span>';
                        echo '<div class="card-body p-3">';
                        echo '<h3 class="card-title">' . htmlspecialchars($tarea['titulo']) . '</h3>';
                        echo '<p class="card-text">' . nl2br(htmlspecialchars($tarea['descripcion'])) . '</p>';
                        echo '<p class="card-text"><small class="text-muted">Creación: ' . $fecha_creacion . ' | Vence: ' . $fecha_vencimiento . '</small></p>';
                        
                        if (!empty($tarea['subtareas'])) {
                            echo '<h3 class="mt-3 visually-hidden">Sub-Tareas:</h3>';
                            echo '<div class="list-group" aria-label="Lista de Sub-Tareas">';
                            foreach ($tarea['subtareas'] as $subtarea) {
                                echo '<div class="list-group-item d-flex align-items-center">';
                                echo '<input type="checkbox" class="form-check-input me-2 subtarea-checkbox" disabled aria-label="Sub-Tarea completada">';
                                echo '<span class="ms-1 text-muted">' . htmlspecialchars($subtarea['titulo']) . '</span>';
                                echo '</div>';
                            }
                            echo '</div>';
                        }
                        
                        echo '<div class="position-absolute bottom-0 start-0 end-0">';
                        echo '<button class="btn btn-danger w-100 recuperar-btn" data-tarea-id="' . htmlspecialchars($tarea['tarea_id']) . '" data-remaining-seconds="' . htmlspecialchars($remainingSeconds) . '" aria-label="Recuperar tarea">';
                        echo '<i class="bi bi-clock-history" aria-hidden="true"></i> ' . $remainingTimeFormatted . ' para recuperar';
                        echo '</button>';
                        echo '</div>';

                        echo '</div>'; 
                        echo '</div>'; 
                    } else {
                        
                        echo '<div class="card mb-3 position-relative">';
                        echo '<span class="badge bg-' . $badgeColor . ' priority-badge">' . htmlspecialchars($tarea['prioridad']) . '</span>';
                        echo '<div class="card-body p-3">';
                        echo '<h3 class="card-title">' . htmlspecialchars($tarea['titulo']) . '</h3>';
                        echo '<p class="card-text">' . nl2br(htmlspecialchars($tarea['descripcion'])) . '</p>';
                        echo '<p class="card-text"><small class="text-muted">Creación: ' . $fecha_creacion . ' | Vence: ' . $fecha_vencimiento . '</small></p>';
                        
                        if (!empty($tarea['subtareas'])) {
                            echo '<h3 class="mt-3 visually-hidden">Sub-Tareas:</h3>';
                            echo '<div class="list-group" aria-label="Lista de Sub-Tareas">';
                            if ($estadoColumna !== 'Eliminada' && $estadoColumna !== 'Finalizado') {
                                foreach ($tarea['subtareas'] as $subtarea) {
                                    $checked = $subtarea['estado'] === 'Completada' ? 'checked' : '';
                                    $subtareaEstadoClase = $subtarea['estado'] === 'Completada' ? 'text-decoration-line-through text-muted' : '';
                                    echo '<div class="list-group-item d-flex align-items-center">';
                                    echo '<input id="subtarea-checkbox-' . htmlspecialchars($subtarea['subtarea_id']) . '" type="checkbox" class="form-check-input me-2 subtarea-checkbox" data-subtarea-id="' . htmlspecialchars($subtarea['subtarea_id']) . '" ' . $checked . ' aria-label="Marcar sub-tarea como ' . ($subtarea['estado'] === 'Completada' ? 'pendiente' : 'completada') . '">';
                                    echo '<label for="subtarea-checkbox-' . htmlspecialchars($subtarea['subtarea_id']) . '" class="ms-1 flex-grow-1 ' . $subtareaEstadoClase . '">' . htmlspecialchars($subtarea['titulo']) . '</label>';
                                    echo '<button type="button" class="btn btn-sm btn-outline-primary me-1 editar-subtarea-btn" data-subtarea-id="' . htmlspecialchars($subtarea['subtarea_id']) . '" aria-label="Editar sub-tarea">';
                                    echo '<i class="bi bi-pencil-square" aria-hidden="true"></i>';
                                    echo '</button>';
                                    echo '<button type="button" class="btn btn-sm btn-outline-danger eliminar-subtarea-btn" data-subtarea-id="' . htmlspecialchars($subtarea['subtarea_id']) . '" aria-label="Eliminar sub-tarea">';
                                    echo '<i class="bi bi-trash" aria-hidden="true"></i>';
                                    echo '</button>';
                                    echo '</div>';
                                }
                            } else {
                                foreach ($tarea['subtareas'] as $subtarea) {
                                    $subtareaEstadoClase = $subtarea['estado'] === 'Completada' ? 'text-decoration-line-through text-muted' : '';
                                    echo '<div class="list-group-item d-flex align-items-center">';
                                    echo '<input type="checkbox" class="form-check-input me-2" disabled aria-label="Sub-Tarea completada">';
                                    echo '<span class="ms-1 flex-grow-1 ' . $subtareaEstadoClase . '">' . htmlspecialchars($subtarea['titulo']) . '</span>';
                                    echo '</div>';
                                }
                            }

                            echo '</div>';
                        }

                        if ($estadoColumna !== 'Eliminada' && $estadoColumna !== 'Finalizado') {                            
                            echo '<button class="btn btn-sm btn-outline-secondary mt-2 agregar-subtarea-btn" data-tarea-id="' . htmlspecialchars($tarea['tarea_id']) . '" aria-label="Agregar Sub-Tarea">';
                            echo '<i class="bi bi-plus-circle" aria-hidden="true"></i> Agregar Sub-Tarea';
                            echo '</button>';
                        }
                        
                        echo '<div class="d-flex justify-content-end mt-3">';                        
                        if ($estadoColumna !== 'Finalizado' && $estadoColumna !== 'Eliminada') {
                            echo '<button class="btn btn-sm btn-warning me-2 editar-btn" data-bs-toggle="modal" data-bs-target="#editarTareaModal" 
                                    data-id="' . htmlspecialchars($tarea['tarea_id']) . '"
                                    data-titulo="' . htmlspecialchars($tarea['titulo']) . '"
                                    data-descripcion="' . htmlspecialchars($tarea['descripcion']) . '"
                                    data-prioridad="' . htmlspecialchars($tarea['prioridad']) . '"
                                    data-estado="' . htmlspecialchars($tarea['estado']) . '"
                                    data-vencimiento="' . htmlspecialchars($tarea['fecha_vencimiento']) . '"
                                        aria-label="Editar tarea">
                                        <i class="bi bi-pencil-square" aria-hidden="true"></i> Editar
                                  </button>';
                        }
                        
                        if ($estadoColumna !== 'Eliminada') {
                            echo '<button class="btn btn-sm btn-info me-2 actualizar-estado-btn" data-bs-toggle="modal" data-bs-target="#actualizarEstadoModal" 
                                    data-id="' . htmlspecialchars($tarea['tarea_id']) . '" aria-label="Actualizar estado de tarea">
                                        <i class="bi bi-arrow-repeat" aria-hidden="true"></i> Actualizar Estado
                                  </button>';
                        }
                        
                        if ($estadoColumna !== 'Eliminada') {
                            echo '<button class="btn btn-sm btn-danger eliminar-btn" data-bs-toggle="modal" data-bs-target="#eliminarTareaModal" 
                                    data-id="' . htmlspecialchars($tarea['tarea_id']) . '" aria-label="Eliminar tarea">
                                        <i class="bi bi-trash" aria-hidden="true"></i> Eliminar
                                  </button>';
                        }
                        echo '</div>'; 
                        echo '</div>'; 
                        echo '</div>'; 
                    }

                }
                echo '</div>'; 
                echo '</div>'; 
                echo '</div>'; 
            }

            renderColumna($tareas, 'Pendiente');
            renderColumna($tareas, 'Ejecutando');
            renderColumna($tareas, 'Finalizado');
            renderColumna($tareas, 'Eliminada'); 
            ?>
        </div>
    </div>
    </main>
    <footer>
        <!-- Puedes agregar un pie de página aquí si es necesario -->
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" defer></script>
    <script>
        window.BASE_URL = '<?php echo $baseURL; ?>';
    </script>
    <script src="js/script.js" defer></script>
</body>

</html>
