let tabla3 = document.getElementById("tableman3");
const usuarioActivo = localStorage.getItem("usuarioActivo");

function cargetable3() {

    fetch("http://localhost:3000/mantenimiento/equipos")
        .then(response => response.json())
        .then(mantenimientos => {

            tabla3.innerHTML = "";
            let contador = 1;

            mantenimientos.forEach((mantenimiento, index) => {

                if (mantenimiento.id_equipo === "PT2-EL02") {

                    let fila = tabla3.insertRow();

                    fila.insertCell(0).innerText = contador;
                    contador++;
                    fila.insertCell(1).innerText = mantenimiento.tipo_mantenimiento_equipo;
                    fila.insertCell(2).innerText = mantenimiento.fecha_mantenimiento_equipo;
                    fila.insertCell(3).innerText = mantenimiento.observacion_equipo;
                    fila.insertCell(4).innerText = mantenimiento.equipo_apto_equipo;
                    fila.insertCell(5).innerText = mantenimiento.realizo_mantenimiento_equipo;
                    fila.insertCell(6).innerText = mantenimiento.reviso_mantenimiento_equipo;
                    fila.insertCell(7).innerText = mantenimiento.novedad_equipo;

                    if (usuarioActivo) {

                        let celdaAccion = fila.insertCell(8);

                        let botoneliminar = document.createElement("button");
                        botoneliminar.innerText = "🗑️";
                        botoneliminar.style.backgroundColor = "white";

                        botoneliminar.addEventListener("click", function () {

                            fetch(`http://localhost:3000/mantenimiento/equipos/${mantenimiento.codigo_mantenimiento_equipo}`, {
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

        })
        .catch(error => console.error("Error:", error));
}

cargetable3();
