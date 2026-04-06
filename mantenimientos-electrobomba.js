let tabla=document.getElementById("tableman") // Obtiene la tabla donde se mostrarán los datos
const usuarioActivo = localStorage.getItem("usuarioActivo"); // Verifica si hay un usuario activo (sesión iniciada)
function cargetable(){// Función para cargar la tabla con los datos de mantenimiento de máquinas
    fetch("http://localhost:3000/mantenimiento/maquinas") 
        .then(response => response.json()) // Convierte la respuesta a JSON
        .then(mantenimientos => { // Itera sobre los mantenimientos obtenidos
            tabla.innerHTML = ""; // Limpia la tabla antes de cargar nuevos datos
            let contador = 1; // Contador para numerar las filas
                mantenimientos.forEach((mantenimiento, index) => { // Por cada mantenimiento, crea una fila en la tabla
                    if (mantenimiento.id_maquina === 'PT2-EL01') { // Filtra por el ID del equipo específico
                        let fila = tabla.insertRow(); // Inserta una nueva fila en la tabla
                        fila.insertCell(0).innerText = contador; // Agrega el número de fila
                        contador++;//aumeta el contador para la siguiente fila
                        fila.insertCell(1).innerText = mantenimiento.tipo_mantenimiento_maquina; // Agrega el tipo de mantenimiento
                        fila.insertCell(2).innerText = mantenimiento.fecha_mantenimiento_maquina; // Agrega la fecha del mantenimiento
                        fila.insertCell(3).innerText = mantenimiento.observacion_maquina;// Agrega las observaciones del mantenimiento
                        fila.insertCell(4).innerText = mantenimiento.equipo_apto_maquina; // Agrega si el equipo está apto
                        fila.insertCell(5).innerText = mantenimiento.realizo_mantenimiento_maquina;
                        fila.insertCell(6).innerText = mantenimiento.reviso_mantenimiento_maquina;
                        fila.insertCell(7).innerText = mantenimiento.novedad_maquina;
                        if (usuarioActivo) { // Si hay un usuario activo, agrega un botón para eliminar el mantenimiento

                            let celdaAccion = fila.insertCell(8);
                            let botoneliminar = document.createElement("button");
                            botoneliminar.innerText = "🗑️";
                            botoneliminar.style.backgroundColor = "white";
                            botoneliminar.addEventListener("click", function () {
                                fetch(`http://localhost:3000/mantenimiento/maquinas/${mantenimiento.codigo_mantenimiento_maquina}`, {
                                    method: "DELETE"
                                })
                                .then(response => {
                                    if (response.ok) {
                                        fila.remove();
                                    } else {
                                        console.error("Error al eliminar el mantenimiento");
                                    }
                                });
                            });
                            celdaAccion.appendChild(botoneliminar);
                            
                        }

                    }
                });
        });


} // Función que carga la tabla con los datos

cargetable() // Llama la función para cargar la tabla al iniciar
