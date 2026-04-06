let tabla2 = document.getElementById("tableman2");
const usuarioActivo = localStorage.getItem("usuarioActivo");

function cargetable2(){

    fetch("http://localhost:3000/mantenimiento/maquinas")
        .then(response => response.json())
        .then(mantenimientos => {
            tabla2.innerHTML = "";
            let contador = 1;
            mantenimientos.forEach((mantenimiento) => {

                if (mantenimiento.id_maquina === "TI-BT01") {

                    let fila = tabla2.insertRow();

                    fila.insertCell(0).innerText = contador;
                    contador++;

                    fila.insertCell(1).innerText = mantenimiento.tipo_mantenimiento_maquina;
                    fila.insertCell(2).innerText = mantenimiento.fecha_mantenimiento_maquina;
                    fila.insertCell(3).innerText = mantenimiento.observacion_maquina;
                    fila.insertCell(4).innerText = mantenimiento.equipo_apto_maquina;
                    fila.insertCell(5).innerText = mantenimiento.realizo_mantenimiento_maquina;
                    fila.insertCell(6).innerText = mantenimiento.reviso_mantenimiento_maquina;
                    fila.insertCell(7).innerText = mantenimiento.novedad_maquina;

                    if (usuarioActivo) {

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

        })
        .catch(error => console.error("Error:", error));
}

cargetable2();
