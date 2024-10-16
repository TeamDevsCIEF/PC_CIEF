// ./js/script.js

document.addEventListener('DOMContentLoaded', () => {
    
    const BASE_URL = window.BASE_URL;
    const actualizarEstadoModal = document.getElementById('actualizarEstadoModal');
    if (actualizarEstadoModal) {
        actualizarEstadoModal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            const tareaId = button.getAttribute('data-id');
            const modal = actualizarEstadoModal;
            modal.querySelector('#estado_tarea_id').value = tareaId;
            const estadoBtns = modal.querySelectorAll('.estado-btn');
            estadoBtns.forEach(btn => btn.classList.remove('active'));
            modal.querySelector('#nuevo_estado').value = '';
        });
        
        const estadoBtns = actualizarEstadoModal.querySelectorAll('.estado-btn');
        estadoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                estadoBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const nuevoEstado = btn.getAttribute('data-estado');
                actualizarEstadoModal.querySelector('#nuevo_estado').value = nuevoEstado;
                estadoBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
                btn.setAttribute('aria-pressed', 'true');
            });
        });
        
        const actualizarEstadoForm = document.getElementById('actualizarEstadoForm');
        if (actualizarEstadoForm) {
            actualizarEstadoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const tareaId = actualizarEstadoForm.querySelector('#estado_tarea_id').value;
                const nuevoEstado = actualizarEstadoForm.querySelector('#nuevo_estado').value;

                if (!nuevoEstado) {
                    alert('Por favor, selecciona un estado.');
                    return;
                }

                fetch(`${BASE_URL}actualizar_estado/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tarea_id: tareaId,
                        nuevo_estado: nuevoEstado
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        const estado = data.estado.normalize('NFC');
                        if (estado === 'éxito') {
                            location.reload();
                        } else {
                            alert('Error al actualizar el estado de la tarea: ' + data.mensaje);
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert('Ocurrió un error al actualizar el estado de la tarea.');
                    });

                const bootstrapModal = bootstrap.Modal.getInstance(actualizarEstadoModal);
                bootstrapModal.hide();
            });
        }
    }
    
    const editarTareaModal = document.getElementById('editarTareaModal');
    if (editarTareaModal) {
        editarTareaModal.addEventListener('show.bs.modal', async (event) => {
            const button = event.relatedTarget;            
            const tarea_id = button.getAttribute('data-id');
            const titulo = button.getAttribute('data-titulo');
            const descripcion = button.getAttribute('data-descripcion');
            const prioridad = button.getAttribute('data-prioridad');
            const estado = button.getAttribute('data-estado');
            const vencimiento = button.getAttribute('data-vencimiento');            
            const modal = editarTareaModal.querySelector('.modal-body');

            modal.querySelector('#edit_tarea_id').value = tarea_id;
            modal.querySelector('#edit_titulo').value = titulo;
            modal.querySelector('#edit_descripcion').value = descripcion;
            modal.querySelector('#edit_prioridad').value = prioridad;
            modal.querySelector('#edit_estado').value = estado;
            modal.querySelector('#edit_vencimiento').value = vencimiento.split(' ')[0]; 

            
            const subtareasContainerEditar = modal.querySelector('#subtareas-container-editar');
            subtareasContainerEditar.innerHTML = '';

            try {
                
                const response = await fetch(`${BASE_URL}obtener_subtareas/index.php?tarea_id=${tarea_id}`);
                const data = await response.json();

                if (Array.isArray(data.resultado)) {
                    data.resultado.forEach(subtarea => {
                        agregarCampoSubtarea(subtareasContainerEditar, subtarea.subtarea_id, subtarea.titulo, subtarea.estado);
                    });
                }
            } catch (error) {
                console.error('Error al obtener sub-tareas:', error);
            }
        });
    }

    function agregarCampoSubtarea(container, subtarea_id = null, titulo = '', estado = 'Pendiente') {
        const subtareaDiv = document.createElement('div');
        subtareaDiv.classList.add('input-group', 'mb-2');
        const subtareaInput = document.createElement('input');
        subtareaInput.type = 'text';
        subtareaInput.name = subtarea_id ? `subtareas_existentes[${subtarea_id}]` : 'subtareas_nuevas[]';
        subtareaInput.classList.add('form-control', 'subtarea-input');
        subtareaInput.placeholder = 'Título de la Sub-Tarea';
        subtareaInput.value = titulo;
        const eliminarBtn = document.createElement('button');
        eliminarBtn.type = 'button';
        eliminarBtn.classList.add('btn', 'btn-outline-danger');
        eliminarBtn.innerHTML = '<i class="bi bi-trash"></i>';
        eliminarBtn.setAttribute('aria-label', 'Eliminar sub-tarea');
        eliminarBtn.addEventListener('click', () => {
            if (subtarea_id) {

                fetch(`${BASE_URL}eliminar_subtarea/index.php`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subtarea_id: subtarea_id
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.estado === 'éxito') {
                            subtareaDiv.remove();
                        } else {
                            alert('Error al eliminar la sub-tarea: ' + data.mensaje);
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert('Ocurrió un error al eliminar la sub-tarea.');
                    });
            } else {
                
                subtareaDiv.remove();
            }
        });
        subtareaDiv.appendChild(subtareaInput);
        subtareaDiv.appendChild(eliminarBtn);
        container.appendChild(subtareaDiv);
    }
    const agregarSubtareaBtnCrear = document.getElementById('agregarSubtareaBtnCrear');
    const subtareasContainerCrear = document.getElementById('subtareas-container-crear');
    if (agregarSubtareaBtnCrear && subtareasContainerCrear) {
        agregarSubtareaBtnCrear.addEventListener('click', () => {
            agregarCampoSubtarea(subtareasContainerCrear);
        });
    }
    
    const agregarSubtareaBtnEditar = document.getElementById('agregarSubtareaBtnEditar');
    const subtareasContainerEditar = document.getElementById('subtareas-container-editar');

    if (agregarSubtareaBtnEditar && subtareasContainerEditar) {
        agregarSubtareaBtnEditar.addEventListener('click', () => {
            agregarCampoSubtarea(subtareasContainerEditar);
        });
    }
    
    document.addEventListener('change', (event) => {
        if (event.target.classList.contains('subtarea-checkbox')) {
            const checkbox = event.target;
            const subtareaId = checkbox.getAttribute('data-subtarea-id');
            const nuevoEstado = checkbox.checked ? 'Completada' : 'Pendiente';       
            fetch(`${BASE_URL}actualizar_subtarea/`, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subtarea_id: subtareaId,
                    estado: nuevoEstado
                }),
            })
                .then(response => response.json())
                .then(data => {

                    const estado = data.estado ? data.estado.normalize('NFC') : '';
                    console.log("estado",estado);
                    if (estado === 'éxito') {
                        const subtareaTitulo = checkbox.parentElement.querySelector('label');
                        if (subtareaTitulo) {
                            if (nuevoEstado === 'Completada') {
                                subtareaTitulo.classList.add('text-decoration-line-through', 'text-muted');
                            } else {
                                subtareaTitulo.classList.remove('text-decoration-line-through', 'text-muted');
                            }
                        } else {
                            console.error('El elemento <label> de la sub-tarea no se encontró.');
                            }
                    } else {
                        alert('Error al actualizar la sub-tarea: ' + data.mensaje);
                        
                        checkbox.checked = !checkbox.checked;
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Ocurrió un error al actualizar la sub-tarea.');
                    
                    checkbox.checked = !checkbox.checked;
                });
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('agregar-subtarea-btn') || event.target.closest('.agregar-subtarea-btn')) {
            const button = event.target.closest('.agregar-subtarea-btn');
            const tareaId = button.getAttribute('data-tarea-id');
            const cardBody = button.closest('.card-body');
            let subtareasList = cardBody.querySelector('.list-group');
            if (!subtareasList) {
                subtareasList = document.createElement('div');
                subtareasList.classList.add('list-group');
                subtareasList.setAttribute('aria-label', 'Lista de Sub-Tareas');
                cardBody.insertBefore(subtareasList, button);
            }

            const lastInput = subtareasList.querySelector('.subtarea-input-new:last-of-type');
            if (lastInput && lastInput.value.trim() === '') {
                lastInput.focus();
                return;
            }

            const subtareaDiv = document.createElement('div');
            subtareaDiv.classList.add('input-group', 'mb-2');

            const subtareaInput = document.createElement('input');
            subtareaInput.type = 'text';
            subtareaInput.name = 'subtarea_titulo';
            subtareaInput.classList.add('form-control', 'subtarea-input-new');
            subtareaInput.placeholder = 'Título de la Sub-Tarea';

            const eliminarBtn = document.createElement('button');
            eliminarBtn.type = 'button';
            eliminarBtn.classList.add('btn', 'btn-outline-danger');
            eliminarBtn.setAttribute('aria-label', 'Eliminar sub-tarea');
            eliminarBtn.innerHTML = '<i class="bi bi-trash"></i>';

            eliminarBtn.addEventListener('click', () => {
                subtareaDiv.remove();
            });

            subtareaDiv.appendChild(subtareaInput);
            subtareaDiv.appendChild(eliminarBtn);

            subtareasList.appendChild(subtareaDiv);

            subtareaInput.addEventListener('blur', () => {
                const titulo = subtareaInput.value.trim();
                if (titulo === '') {
                    subtareaDiv.remove();
                    return;
                }

                fetch(`${BASE_URL}crear_subtarea/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tarea_id: tareaId,
                        titulo: titulo,
                        descripcion: '',
                        estado: 'Pendiente'
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.estado === 'éxito') {
                            subtareaDiv.remove();

                            const subtareaLabel = document.createElement('div');
                            subtareaLabel.classList.add('list-group-item', 'd-flex', 'align-items-center');

                            const subtareaCheckbox = document.createElement('input');
                            subtareaCheckbox.type = 'checkbox';
                            subtareaCheckbox.classList.add('form-check-input', 'me-2', 'subtarea-checkbox');
                            subtareaCheckbox.setAttribute('data-subtarea-id', data.subtarea_id);
                            subtareaCheckbox.id = `subtarea-checkbox-${data.subtarea_id}`; 
                            subtareaCheckbox.setAttribute('aria-label', `Marcar sub-tarea como pendiente`);

                            const subtareaTitulo = document.createElement('label');
                            subtareaTitulo.classList.add('ms-1','flex-grow-1');
                            subtareaTitulo.textContent = titulo;
                            
                            const editarBtn = document.createElement('button');
                            editarBtn.type = 'button';
                            editarBtn.classList.add('btn', 'btn-sm', 'btn-outline-primary', 'me-1', 'editar-subtarea-btn');
                            editarBtn.setAttribute('data-subtarea-id', data.subtarea_id);
                            editarBtn.setAttribute('aria-label', 'Editar sub-tarea'); 
                            editarBtn.innerHTML = '<i class="bi bi-pencil-square" aria-hidden="true"></i>';

                            const eliminarBtn = document.createElement('button');
                            eliminarBtn.type = 'button';
                            eliminarBtn.classList.add('btn', 'btn-sm', 'btn-outline-danger', 'eliminar-subtarea-btn');
                            eliminarBtn.setAttribute('data-subtarea-id', data.subtarea_id);
                            eliminarBtn.setAttribute('aria-label', 'Eliminar sub-tarea'); 
                            eliminarBtn.innerHTML = '<i class="bi bi-trash" aria-hidden="true"></i>';
                            subtareaLabel.appendChild(subtareaCheckbox);
                            subtareaLabel.appendChild(subtareaTitulo);
                            subtareaLabel.appendChild(editarBtn);
                            subtareaLabel.appendChild(eliminarBtn);

                            subtareasList.appendChild(subtareaLabel);
                        } else {
                            alert('Error al crear la sub-tarea: ' + data.mensaje);
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert('Ocurrió un error al crear la sub-tarea.');
                    });
            });

            subtareaInput.focus();
        }
    });

    const crearTareaForm = document.getElementById('crearTareaForm');
    if (crearTareaForm) {
        crearTareaForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(crearTareaForm);
            const titulo = formData.get('titulo').trim();
            const descripcion = formData.get('descripcion').trim();
            const prioridad = formData.get('prioridad');
            const vencimiento = formData.get('vencimiento');
            const subtareas = formData.getAll('subtareas_nuevas[]').filter(t => t.trim() !== '');

            if (titulo === '' || descripcion === '' || vencimiento === '') {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }
            
            try {
                const response = await fetch(`${BASE_URL}crear_tarea/index.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        titulo: titulo,
                        descripcion: descripcion,
                        prioridad: prioridad,
                        estado: 'Pendiente',
                        fecha_vencimiento: vencimiento
                    }),
                });

                const data = await response.json();

                if (data.estado === 'éxito') {
                    const tarea_id = data.tarea_id;

                    
                    for (const subtareaTitulo of subtareas) {
                        await fetch(`${BASE_URL}crear_subtarea/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                tarea_id: tarea_id,
                                titulo: subtareaTitulo,
                                descripcion: '',
                                estado: 'Pendiente'
                            }),
                        });
                    }
                    
                    window.location.reload();
                } else {
                    alert('Error al crear la tarea: ' + data.mensaje);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Ocurrió un error al crear la tarea.');
            }
        });
    }

    const editarTareaForm = document.getElementById('editarTareaForm');
    if (editarTareaForm) {
        editarTareaForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(editarTareaForm);
            const tarea_id = formData.get('tarea_id');
            const titulo = formData.get('titulo').trim();
            const descripcion = formData.get('descripcion').trim();
            const prioridad = formData.get('prioridad');
            const estado = formData.get('estado');
            const vencimiento = formData.get('vencimiento');
            const subtareas_existentes = formData.getAll('subtareas_existentes[]').filter(t => t.trim() !== '');
            const subtareas_nuevas = formData.getAll('subtareas_nuevas[]').filter(t => t.trim() !== '');

            if (titulo === '' || descripcion === '' || vencimiento === '') {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }
            
            try {
                const response = await fetch(`${BASE_URL}actualizar_tarea/index.php`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tarea_id: tarea_id,
                        titulo: titulo,
                        descripcion: descripcion,
                        prioridad: prioridad,
                        estado: estado,
                        fecha_vencimiento: vencimiento
                    }),
                });

                const data = await response.json();

                if (data.estado === 'éxito') {
                    
                    //const subtareasIds = formData.getAll('subtareas_existentes_ids[]');
                    const subtareasIds = Array.from(editarTareaForm.querySelectorAll('.subtarea-input'))
                    .filter(input => input.name.startsWith('subtareas_existentes'))
                    .map(input => input.name.match(/\d+/)[0]);

                    for (let i = 0; i < subtareasIds.length; i++) {
                        const subtarea_id = subtareasIds[i];
                        const subtareaTitulo = subtareas_existentes[i];

                        await fetch(`${BASE_URL}actualizar_subtarea/`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                subtarea_id: subtarea_id,
                                titulo: subtareaTitulo,
                                estado: 'Pendiente' 
                            }),
                        });
                    }

                    
                    for (const subtareaTitulo of subtareas_nuevas) {
                        await fetch(`${BASE_URL}crear_subtarea/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                tarea_id: tarea_id,
                                titulo: subtareaTitulo,
                                descripcion: '',
                                estado: 'Pendiente'
                            }),
                        });
                    }

                    
                    window.location.reload();
                } else {
                    alert('Error al editar la tarea: ' + data.mensaje);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Ocurrió un error al editar la tarea.');
            }
        });
    }

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('editar-subtarea-btn') || event.target.closest('.editar-subtarea-btn')) {
            const button = event.target.closest('.editar-subtarea-btn');
            const subtareaId = button.getAttribute('data-subtarea-id');
            const subtareaItem = button.closest('.list-group-item');
            const subtareaTituloSpan = subtareaItem.querySelector('label');
            const checkbox = subtareaItem.querySelector('.subtarea-checkbox');
            if (!checkbox) {
                console.error('Checkbox no encontrado para la sub-tarea.');
                return;
            }
            checkbox.type = 'hidden';
            const subtareaInput = document.createElement('input');
            subtareaInput.type = 'text';
            subtareaInput.classList.add('form-control', 'form-control-sm');
            subtareaInput.value = subtareaTituloSpan.textContent;
            subtareaInput.setAttribute('aria-label', 'Editar título de sub-tarea');
            subtareaItem.replaceChild(subtareaInput, subtareaTituloSpan);
            subtareaInput.addEventListener('blur', actualizarSubtarea);
            subtareaInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    subtareaInput.blur();
                }
            });

            subtareaInput.focus();
            subtareaInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    subtareaItem.replaceChild(subtareaTituloSpan, subtareaInput);
                    checkbox.type = 'checkbox';
                }
            });
            function actualizarSubtarea() {
                const nuevoTitulo = subtareaInput.value.trim();
                const estado= checkbox.checked ? "Completada":"Pendiente";
                if (nuevoTitulo === '') {
                    subtareaInput.focus();
                    return;
                }

                fetch(`${BASE_URL}actualizar_subtarea/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subtarea_id: subtareaId,
                        titulo: nuevoTitulo,
                        estado:estado
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        const estadoRespuesta = data.estado ? data.estado.normalize('NFC') : '';
                        if (estadoRespuesta === 'éxito') {
                            subtareaTituloSpan.textContent = nuevoTitulo;
                            subtareaItem.replaceChild(subtareaTituloSpan, subtareaInput);
                            checkbox.type = 'checkbox';
                            if (estado === 'Completada') {
                                subtareaTituloSpan.classList.add('text-decoration-line-through', 'text-muted');
                            } else {
                                subtareaTituloSpan.classList.remove('text-decoration-line-through', 'text-muted');
                            }
                        } else {
                            alert('Error al actualizar la sub-tarea: ' + data.mensaje);
                            subtareaInput.focus();
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert('Ocurrió un error al actualizar la sub-tarea.');
                        subtareaInput.focus();
                    });
            }
        }

        if (event.target.classList.contains('eliminar-subtarea-btn') || event.target.closest('.eliminar-subtarea-btn')) {
            const button = event.target.closest('.eliminar-subtarea-btn');
            const subtareaId = button.getAttribute('data-subtarea-id');
            const subtareaItem = button.closest('.list-group-item');
           
            const eliminarSubtareaModal = document.getElementById('eliminarSubtareaModal');
            eliminarSubtareaModal.querySelector('#delete_subtarea_id').value = subtareaId;
            eliminarSubtareaModal.subtareaItem = subtareaItem;
            
            const bootstrapModal = new bootstrap.Modal(eliminarSubtareaModal);
            bootstrapModal.show();
        }
    });
        
        const eliminarSubtareaForm = document.getElementById('eliminarSubtareaForm');
        if (eliminarSubtareaForm) {
            eliminarSubtareaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const subtareaId = eliminarSubtareaForm.querySelector('#delete_subtarea_id').value;
                const subtareaItem = document.getElementById('eliminarSubtareaModal').subtareaItem;

                fetch(`${BASE_URL}eliminar_subtarea/index.php`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subtarea_id: subtareaId
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.estado === 'éxito') {
                            subtareaItem.remove();
                        } else {
                            alert('Error al eliminar la sub-tarea: ' + data.mensaje);
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert('Ocurrió un error al eliminar la sub-tarea.');
                    });

                const bootstrapModal = bootstrap.Modal.getInstance(eliminarSubtareaForm.closest('.modal'));
                bootstrapModal.hide();
            });
        }
       
        const eliminarTareaModal = document.getElementById('eliminarTareaModal');
        if (eliminarTareaModal) {
            eliminarTareaModal.addEventListener('show.bs.modal', (event) => {
                const button = event.relatedTarget;
                const tareaId = button.getAttribute('data-id');
                const modal = eliminarTareaModal;
                modal.querySelector('#delete_tarea_id').value = tareaId;
            });
        }
    
    const recuperarButtons = document.querySelectorAll('.recuperar-btn');
    recuperarButtons.forEach(button => {
        const tareaId = button.getAttribute('data-tarea-id');
        let remainingSeconds = parseInt(button.getAttribute('data-remaining-seconds'), 10);
        
        const intervalId = setInterval(() => {
            if (remainingSeconds <= 0) {
                clearInterval(intervalId);
                button.innerHTML = '<i class="bi bi-clock-history"></i> 00:00 Expirado';
                button.disabled = true;
            } else {
                remainingSeconds--;
                const minutes = Math.floor(remainingSeconds / 60);
                const seconds = remainingSeconds % 60;
                const remainingTimeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                button.innerHTML = `<i class="bi bi-clock-history"></i> ${remainingTimeFormatted} para recuperar`;
            }
        }, 1000);
        
        button.addEventListener('click', () => {
            
            const confirmarRecuperacionModalEl = document.getElementById('confirmarRecuperacionModal');
            const confirmarRecuperacionModal = new bootstrap.Modal(confirmarRecuperacionModalEl);
            confirmarRecuperacionModalEl.querySelector('#recuperar_tarea_id').value = tareaId;
            confirmarRecuperacionModal.show();
        });
    });
    
    const confirmarRecuperacionForm = document.getElementById('confirmarRecuperacionForm');
    if (confirmarRecuperacionForm) {
        confirmarRecuperacionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const tareaId = confirmarRecuperacionForm.querySelector('#recuperar_tarea_id').value;            
            const actualizarEstadoModalEl = document.getElementById('actualizarEstadoModal');
            const actualizarEstadoModal = new bootstrap.Modal(actualizarEstadoModalEl);
            actualizarEstadoModalEl.querySelector('#estado_tarea_id').value = tareaId;
            actualizarEstadoModal.show();
            const confirmarRecuperacionModal = bootstrap.Modal.getInstance(confirmarRecuperacionForm.closest('.modal'));
            confirmarRecuperacionModal.hide();
        });
    }
});
