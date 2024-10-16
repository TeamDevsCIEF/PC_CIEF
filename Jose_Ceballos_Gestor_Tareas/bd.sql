
/*DROP DATABASE IF EXISTS if0_37524230_gestor_tareas;*/


/*CREATE DATABASE IF NOT EXISTS if0_37524230_gestor_tareas;*/
USE if0_37524230_gestor_tareas;


CREATE TABLE IF NOT EXISTS tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    prioridad ENUM('Urgente', 'Alta', 'Media', 'Baja') DEFAULT 'Media',
    estado ENUM('Pendiente', 'Ejecutando', 'Finalizado', 'Eliminada') DEFAULT 'Pendiente',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_vencimiento DATETIME,
    time_to_destroy INT DEFAULT 300, 
    fecha_eliminacion DATETIME DEFAULT NULL
);


CREATE TABLE IF NOT EXISTS sub_tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarea_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado ENUM('Pendiente', 'Completada') DEFAULT 'Pendiente',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE
);


INSERT INTO tareas (titulo, descripcion, prioridad, estado, fecha_vencimiento,time_to_destroy,fecha_eliminacion) VALUES
('Compra de Materiales', 'Comprar materiales para la oficina', 'Baja', 'Pendiente', '2024-10-20',90,NULL),
('Lorem 1', 'Tarea X', 'Baja', 'Ejecutando', '2024-10-20',90,NULL),
('Reunión con pepito', 'Tratar firma del contrato', 'Urgente', 'Finalizado', '2024-10-20',90,NULL),
('Pagar la renta', 'Mes de Uctubre', 'Media', 'Eliminada', '2024-10-20',300,CURRENT_TIMESTAMP),
('Llamar al Ayuntamiento', 'Solicitar cita previa', 'Baja', 'Eliminada', '2024-10-20',710,CURRENT_TIMESTAMP);

INSERT INTO sub_tareas (tarea_id, titulo, descripcion, estado) VALUES
(1, 'Diseñar Wireframes', 'Crear los wireframes iniciales', 'Pendiente');


DELIMITER //


CREATE PROCEDURE InsertarTareaJSON(
    IN p_tarea_datos JSON
)
BEGIN
    DECLARE v_titulo VARCHAR(255);
    DECLARE v_descripcion TEXT;
    DECLARE v_prioridad ENUM('Urgente', 'Alta', 'Media', 'Baja');
    DECLARE v_estado ENUM('Pendiente', 'Ejecutando', 'Finalizado', 'Eliminada');
    DECLARE v_fecha_vencimiento DATETIME;
    DECLARE v_response JSON;

    
    SET v_titulo = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.titulo'));
    SET v_descripcion = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.descripcion'));
    SET v_prioridad = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.prioridad'));
    SET v_estado = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.estado'));
    SET v_fecha_vencimiento = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.fecha_vencimiento'));

    INSERT INTO tareas (titulo, descripcion, prioridad, estado, fecha_vencimiento)
    VALUES (v_titulo, v_descripcion, v_prioridad, v_estado, v_fecha_vencimiento);

    SET v_response = JSON_OBJECT(
        'estado', 'éxito',
        'mensaje', 'Tarea creada correctamente',
        'tarea_id', LAST_INSERT_ID()
    );

    SELECT v_response AS resultado;
END //


CREATE PROCEDURE ActualizarEstadoTareaJSON(
    IN p_estado_datos JSON
)
BEGIN
    DECLARE v_tarea_id INT;
    DECLARE v_nuevo_estado ENUM('Pendiente', 'Ejecutando', 'Finalizado', 'Eliminada');
    DECLARE v_estado_previo ENUM('Pendiente', 'Ejecutando', 'Finalizado', 'Eliminada');
    DECLARE v_response JSON;

    SET v_tarea_id = JSON_UNQUOTE(JSON_EXTRACT(p_estado_datos, '$.tarea_id'));
    SET v_nuevo_estado = JSON_UNQUOTE(JSON_EXTRACT(p_estado_datos, '$.nuevo_estado'));

    SELECT estado INTO v_estado_previo FROM tareas WHERE id = v_tarea_id;

    UPDATE tareas
    SET estado = v_nuevo_estado,
        fecha_actualizacion = CURRENT_TIMESTAMP,
        fecha_eliminacion = CASE WHEN v_nuevo_estado = 'Eliminada' THEN CURRENT_TIMESTAMP ELSE NULL END
    WHERE id = v_tarea_id;

    SET v_response = JSON_OBJECT(
        'estado', 'éxito',
        'mensaje', 'Estado de la tarea actualizado correctamente',
        'tarea_id', v_tarea_id,
        'estado_previo', v_estado_previo,
        'nuevo_estado', v_nuevo_estado
    );

    SELECT v_response AS resultado;
END //


CREATE PROCEDURE ActualizarTareaJSON(
    IN p_tarea_datos JSON
)
BEGIN
    DECLARE v_tarea_id INT;
    DECLARE v_titulo VARCHAR(255);
    DECLARE v_descripcion TEXT;
    DECLARE v_prioridad ENUM('Urgente', 'Alta', 'Media', 'Baja');
    DECLARE v_estado ENUM('Pendiente', 'Ejecutando', 'Finalizado', 'Eliminada');
    DECLARE v_fecha_vencimiento DATETIME;
    DECLARE v_response JSON;

    
    SET v_tarea_id = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.tarea_id'));
    SET v_titulo = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.titulo'));
    SET v_descripcion = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.descripcion'));
    SET v_prioridad = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.prioridad'));
    SET v_estado = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.estado'));
    SET v_fecha_vencimiento = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.fecha_vencimiento'));

    
    IF EXISTS (SELECT 1 FROM tareas WHERE id = v_tarea_id AND estado != 'Eliminada') THEN
        UPDATE tareas
        SET titulo = v_titulo,
            descripcion = v_descripcion,
            prioridad = v_prioridad,
            estado = v_estado,
            fecha_vencimiento = v_fecha_vencimiento,
            fecha_actualizacion = CURRENT_TIMESTAMP,
            fecha_eliminacion = CASE WHEN v_estado = 'Eliminada' THEN CURRENT_TIMESTAMP ELSE NULL END
        WHERE id = v_tarea_id;

        SET v_response = JSON_OBJECT(
            'estado', 'éxito',
            'mensaje', 'Tarea actualizada correctamente',
            'tarea_id', v_tarea_id
        );
    ELSE
        SET v_response = JSON_OBJECT(
            'estado', 'error',
            'mensaje', 'Tarea no encontrada o está eliminada',
            'tarea_id', v_tarea_id
        );
    END IF;

    SELECT v_response AS resultado;
END //


CREATE PROCEDURE ObtenerTareasJSON()
BEGIN
    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'tarea_id', t.id,
            'titulo', t.titulo,
            'descripcion', t.descripcion,
            'prioridad', t.prioridad,
            'estado', t.estado,
            'fecha_creacion', t.fecha_creacion,
            'fecha_actualizacion', t.fecha_actualizacion,
            'fecha_vencimiento', t.fecha_vencimiento,
            'time_to_destroy', t.time_to_destroy,
            'fecha_eliminacion', t.fecha_eliminacion,
            'subtareas', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'subtarea_id', st.id,
                        'titulo', st.titulo,
                        'descripcion', st.descripcion,
                        'estado', st.estado,
                        'fecha_creacion', st.fecha_creacion,
                        'fecha_actualizacion', st.fecha_actualizacion
                    )
                )
                FROM sub_tareas st
                WHERE st.tarea_id = t.id
            )
        )
    ) AS resultado
    FROM tareas t
    ORDER BY t.fecha_vencimiento DESC;
END //


CREATE PROCEDURE EliminarTareaJSON(
    IN p_tarea_datos JSON
)
BEGIN
    DECLARE v_tarea_id INT;
    DECLARE v_response JSON;

    SET v_tarea_id = JSON_UNQUOTE(JSON_EXTRACT(p_tarea_datos, '$.tarea_id'));

    IF EXISTS (SELECT 1 FROM tareas WHERE id = v_tarea_id AND estado != 'Eliminada') THEN
        UPDATE tareas
        SET estado = 'Eliminada',
            fecha_actualizacion = CURRENT_TIMESTAMP,
            fecha_eliminacion = CURRENT_TIMESTAMP
        WHERE id = v_tarea_id;

        
        SET v_response = JSON_OBJECT(
            'estado', 'éxito',
            'mensaje', 'Tarea eliminada correctamente',
            'tarea_id', v_tarea_id
        );
    ELSE
        
        SET v_response = JSON_OBJECT(
            'estado', 'error',
            'mensaje', 'Tarea no encontrada o ya eliminada',
            'tarea_id', v_tarea_id
        );
    END IF;

    SELECT v_response AS resultado;
END //


CREATE PROCEDURE ObtenerDetallesTareaJSON(
    IN p_tarea_id INT
)
BEGIN
    DECLARE v_response JSON;

    SELECT JSON_OBJECT(
        'tarea_id', t.id,
        'titulo', t.titulo,
        'descripcion', t.descripcion,
        'prioridad', t.prioridad,
        'estado', t.estado,
        'fecha_creacion', t.fecha_creacion,
        'fecha_actualizacion', t.fecha_actualizacion,
        'fecha_vencimiento', t.fecha_vencimiento,
        'time_to_destroy', t.time_to_destroy,
        'fecha_eliminacion', t.fecha_eliminacion
    ) AS resultado
    FROM tareas t
    WHERE t.id = p_tarea_id;
END //




CREATE PROCEDURE InsertarSubTareaJSON(
    IN p_subtarea_datos JSON
)
BEGIN
    DECLARE v_tarea_id INT;
    DECLARE v_titulo VARCHAR(255);
    DECLARE v_descripcion TEXT;
    DECLARE v_estado ENUM('Pendiente', 'Completada');
    DECLARE v_response JSON;

    
    SET v_tarea_id = JSON_UNQUOTE(JSON_EXTRACT(p_subtarea_datos, '$.tarea_id'));
    SET v_titulo = JSON_UNQUOTE(JSON_EXTRACT(p_subtarea_datos, '$.titulo'));
    SET v_descripcion = JSON_UNQUOTE(JSON_EXTRACT(p_subtarea_datos, '$.descripcion'));
    SET v_estado = JSON_UNQUOTE(JSON_EXTRACT(p_subtarea_datos, '$.estado'));

    INSERT INTO sub_tareas (tarea_id, titulo, descripcion, estado)
    VALUES (v_tarea_id, v_titulo, v_descripcion, v_estado);

    SET v_response = JSON_OBJECT(
        'estado', 'éxito',
        'mensaje', 'Sub-tarea creada correctamente',
        'subtarea_id', LAST_INSERT_ID()
    );

    SELECT v_response AS resultado;
END //


CREATE PROCEDURE ActualizarSubTareaJSON(
    IN p_subtarea_datos JSON
)
BEGIN
    DECLARE v_subtarea_id INT;
    DECLARE v_nuevo_estado ENUM('Pendiente', 'Completada');
    DECLARE v_nuevo_titulo VARCHAR(255);
    DECLARE v_response JSON;

    SET v_subtarea_id = JSON_UNQUOTE(JSON_EXTRACT(p_subtarea_datos, '$.subtarea_id'));
    SET v_nuevo_estado = JSON_UNQUOTE(JSON_EXTRACT(p_subtarea_datos, '$.estado'));
    SET v_nuevo_titulo = JSON_UNQUOTE(JSON_EXTRACT(p_subtarea_datos, '$.titulo'));

    IF EXISTS (SELECT 1 FROM sub_tareas WHERE id = v_subtarea_id) THEN
        UPDATE sub_tareas
        SET 
            titulo = COALESCE(v_nuevo_titulo, titulo),
            estado = COALESCE(v_nuevo_estado, estado),
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = v_subtarea_id;

        SET v_response = JSON_OBJECT(
            'estado', 'éxito',
            'mensaje', 'Sub-tarea actualizada correctamente',
            'subtarea_id', v_subtarea_id
        );
    ELSE
        SET v_response = JSON_OBJECT(
            'estado', 'error',
            'mensaje', 'Sub-tarea no encontrada',
            'subtarea_id', v_subtarea_id
        );
    END IF;

    SELECT v_response AS resultado;
END //


CREATE PROCEDURE EliminarSubTareaJSON(
    IN p_subtarea_datos JSON
)
BEGIN
    DECLARE v_subtarea_id INT;
    DECLARE v_response JSON;

    SET v_subtarea_id = JSON_UNQUOTE(JSON_EXTRACT(p_subtarea_datos, '$.subtarea_id'));

    DELETE FROM sub_tareas WHERE id = v_subtarea_id;

    SET v_response = JSON_OBJECT(
        'estado', 'éxito',
        'mensaje', 'Sub-tarea eliminada correctamente',
        'subtarea_id', v_subtarea_id
    );

    SELECT v_response AS resultado;
END //


CREATE PROCEDURE ObtenerSubTareasPorTareaJSON(
    IN p_tarea_id INT
)
BEGIN
    DECLARE v_response JSON;

    SELECT COALESCE(JSON_ARRAYAGG(
    JSON_OBJECT(
        'subtarea_id', st.id,
        'titulo', st.titulo,
        'descripcion', st.descripcion,
        'estado', st.estado,
        'fecha_creacion', st.fecha_creacion,
        'fecha_actualizacion', st.fecha_actualizacion
    )
), JSON_ARRAY()) AS resultado
FROM sub_tareas st
WHERE st.tarea_id = p_tarea_id;

END //




CREATE PROCEDURE ActualizarEstadoSubTareaJSON(
    IN p_estado_subtarea_datos JSON
)
BEGIN
    DECLARE v_subtarea_id INT;
    DECLARE v_nuevo_estado ENUM('Pendiente', 'Completada');
    DECLARE v_response JSON;

    SET v_subtarea_id = JSON_UNQUOTE(JSON_EXTRACT(p_estado_subtarea_datos, '$.subtarea_id'));
    SET v_nuevo_estado = JSON_UNQUOTE(JSON_EXTRACT(p_estado_subtarea_datos, '$.estado'));

    IF EXISTS (SELECT 1 FROM sub_tareas WHERE id = v_subtarea_id) THEN
        UPDATE sub_tareas
        SET estado = v_nuevo_estado,
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = v_subtarea_id;

        SET v_response = JSON_OBJECT(
            'estado', 'éxito',
            'mensaje', 'Estado de la sub-tarea actualizado correctamente',
            'subtarea_id', v_subtarea_id
        );
    ELSE
        SET v_response = JSON_OBJECT(
            'estado', 'error',
            'mensaje', 'Sub-tarea no encontrada',
            'subtarea_id', v_subtarea_id
        );
    END IF;

    SELECT v_response AS resultado;
END //

DELIMITER ;




CREATE OR REPLACE VIEW vista_tareas AS
SELECT
    t.id AS tarea_id,
    t.titulo,
    t.descripcion,
    t.prioridad,
    t.estado,
    t.fecha_creacion,
    t.fecha_actualizacion,
    t.fecha_vencimiento,
    t.time_to_destroy,
    t.fecha_eliminacion
FROM tareas t;


CREATE OR REPLACE VIEW vista_sub_tareas AS
SELECT
    st.id AS subtarea_id,
    st.tarea_id,
    st.titulo,
    st.descripcion,
    st.estado,
    st.fecha_creacion,
    st.fecha_actualizacion,
    t.titulo AS tarea_titulo
FROM sub_tareas st
JOIN tareas t ON st.tarea_id = t.id;

SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS auto_delete_tasks
ON SCHEDULE EVERY 60 MINUTE
DO
    DELETE FROM tareas
    WHERE estado = 'Eliminada' AND fecha_eliminacion IS NOT NULL
    AND NOW() >= DATE_ADD(fecha_eliminacion, INTERVAL time_to_destroy SECOND);

