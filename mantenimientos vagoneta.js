
let tabla5=document.getElementById("tableman5")
const usuarioActivo = localStorage.getItem("usuarioActivo");
function cargetable(){
    fetch("http://localhost:3000/mantenimiento/equipos")
    .then(res => res.json())
    .then(mantenimiento => {
        tabla5.innerHTML = "";
        let contador = 1;
        mantenimiento.forEach((mantenimiento, a) => {
            if(mantenimiento.id_equipo === 'S666S'){
                let fila = tabla5.insertRow();
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
    });

}

cargetable()
