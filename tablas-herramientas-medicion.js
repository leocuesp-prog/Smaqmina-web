let tabla = document.getElementById("tabladatos");
const usuarioActivo = localStorage.getItem("usuarioActivo");

function cargarTabla() {

    fetch("http://localhost:3000/herramientas/medicion")
        .then(res => res.json())
        .then(herramientas => {

            tabla.innerHTML = "";

            herramientas.forEach((herramienta, i) => {

                let fila = tabla.insertRow();

                fila.insertCell(0).innerText = i + 1;

                let nombreCell = fila.insertCell(1);
                nombreCell.innerText = herramienta.nombre_herramienta_medicion;

                let cantidadCell = fila.insertCell(2);
                cantidadCell.innerText = herramienta.cantidad_buena_medicion;

                let celdaEstado = fila.insertCell(3);

                let select = document.createElement("select");
                let estados = ["Bueno", "Regular", "Malo"];

                estados.forEach(function (estado) {
                    let option = document.createElement("option");
                    option.text = estado;
                    select.add(option);
                });

                select.addEventListener("change", function () {

                    if (select.value === "Bueno") {
                        cantidadCell.innerText = herramienta.cantidad_buena_medicion;
                    }
                    if (select.value === "Regular") {
                        cantidadCell.innerText = herramienta.cantidad_regular_medicion;
                    }
                    if (select.value === "Malo") {
                        cantidadCell.innerText = herramienta.cantidad_mala_medicion;
                    }
                });

                celdaEstado.appendChild(select);

                // ACCIONES SOLO SI HAY USUARIO
                if (usuarioActivo) {

                    let celdaAccion = fila.insertCell(4);

                    let botonEliminar = document.createElement("button");
                    botonEliminar.innerText = "🗑️";

                    botonEliminar.addEventListener("click", function () {
                        if (confirm("¿Estás seguro de que deseas eliminar esta herramienta?")) {
                            fetch(`http://localhost:3000/herramientas/medicion/${herramienta.id_herramienta_medicion}`, {
                                method: "DELETE"
                            })
                                .then(res => res.json())
                                .then(datos => {
                                    alert(datos.mensaje);
                                    cargarTabla();
                                })
                                .catch(error => {
                                    console.error("Error:", error);
                                    alert("Error al eliminar la herramienta");
                                });
                        }
                    });

                    celdaAccion.appendChild(botonEliminar);
                }

            });

        })
        .catch(error => console.error("Error:", error));
}

cargarTabla();
