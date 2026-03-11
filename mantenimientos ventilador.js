let tabla6=document.getElementById("tableman6")
const usuarioActivo = localStorage.getItem("usuarioActivo");
function cargarMantenimientos() {
    fetch("http://localhost:3000/mantenimiento/maquinas")
        .then(response => response.json())
        .then(mantenimientos => {
            tabla6.innerHTML = ""; // Limpiar tabla antes de cargar datos
            let contador = 1; // Contador para numerar filas
                mantenimientos.forEach((mantenimiento, index) => {
                    if (mantenimiento.id_maquina === 'PM-VE06') {
                        let fila = tabla6.insertRow();
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
                                fetch(`http://localhost:3000/mantenimiento/maquina/${mantenimiento.id_mantenimiento_maquina}`, {
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
    };

cargarMantenimientos()
/* Abrir / cerrar menú */
boton.addEventListener("click", () => {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
});

/* FUNCIONES */

function toggleOscuro(){
    document.body.classList.toggle("dark-mode");
    guardarConfig();
}

function toggleContraste(){
    document.body.classList.toggle("alto-contraste");
    guardarConfig();
}


function mayusculas(){
    document.body.classList.toggle("mayusculas");
    guardarConfig();
}

function resetEstilos(){
    document.body.classList.remove("dark-mode", "alto-contraste", "mayusculas");
    localStorage.removeItem("configAccesibilidad");
}
function leerPagina(){
    if (speechSynthesis.speaking) return;

    let texto = document.body.innerText;
    vozActiva = new SpeechSynthesisUtterance(texto);

    speechSynthesis.speak(vozActiva);
}
function detenerLectura() {
    speechSynthesis.cancel();
}
/* GUARDAR CONFIGURACIÓN */

function guardarConfig(){
    localStorage.setItem("configAccesibilidad", JSON.stringify({
        oscuro: document.body.classList.contains("dark-mode"),
        contraste: document.body.classList.contains("alto-contraste"),
        mayuscula: document.body.classList.contains("mayusculas"),
    }));
}

/* CARGAR CONFIGURACIÓN */

window.onload = function(){
    let config = JSON.parse(localStorage.getItem("configAccesibilidad"));

    if(config){
        if(config.oscuro) document.body.classList.add("dark-mode");
        if(config.contraste) document.body.classList.add("alto-contraste");
        if(config.mayuscula) document.body.classList.add("mayusculas");
    }
}

