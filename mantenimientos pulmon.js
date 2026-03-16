let tabla = document.getElementById("tableman");
const usuarioActivo = localStorage.getItem("usuarioActivo");

function cargarMantenimientos() {

    fetch("http://localhost:3000/mantenimiento/equipos")
        .then(response => response.json())
        .then(mantenimientos => {

            tabla.innerHTML = "";
            let contador = 1;

            mantenimientos.forEach((mantenimiento, index) => {

                // 🔹 FILTRAR POR LA LLAVE FORÁNEA
                if (mantenimiento.id_equipo === 'NP-PU01') {

                    let fila = tabla.insertRow();

                    fila.insertCell(0).innerText = contador;
                    contador++
                    fila.insertCell(1).innerText = mantenimiento.tipo_mantenimiento_equipo;
                    fila.insertCell(2).innerText = mantenimiento.fecha_mantenimiento_equipo;
                    fila.insertCell(3).innerText = mantenimiento.observacion_equipo;
                    fila.insertCell(4).innerText = mantenimiento.equipo_apto_equipo;
                    fila.insertCell(5).innerText = mantenimiento.realizo_mantenimiento_equipo;
                    fila.insertCell(6).innerText = mantenimiento.reviso_mantenimiento_equipo;
                    fila.insertCell(7).innerText = mantenimiento.novedad_equipo;

                    // 🔹 BOTÓN ELIMINAR SOLO SI HAY USUARIO ACTIVO
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

cargarMantenimientos();
let menu = document.getElementById("menuAccesibilidad");
let boton = document.getElementById("botonAccesibilidad");

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


