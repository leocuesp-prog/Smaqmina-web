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
let menu = document.getElementById("menuAccesibilidad");
let boton = document.getElementById("botonAccesibilidad");

if (menu && boton) {

    boton.addEventListener("click", () => {
        menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    });

}
let tamañoActual = localStorage.getItem("tamañoTexto") || 16;

document.body.style.fontSize = tamañoActual + "px";
function resetTamañoTexto() {
    tamañoActual = 16;
    document.body.style.fontSize = "16px";
    localStorage.removeItem("tamañoTexto");
}
function aumentarTexto() {
    if (tamañoActual < 20) {
    tamañoActual = parseInt(tamañoActual) + 2;
    document.body.style.fontSize = tamañoActual + "px";
    localStorage.setItem("tamañoTexto", tamañoActual);
    }
}

function disminuirTexto() {
    if (tamañoActual > 12) {
        tamañoActual = parseInt(tamañoActual) - 2;
        document.body.style.fontSize = tamañoActual + "px";
        localStorage.setItem("tamañoTexto", tamañoActual);
    }
}
function toggleOscuro() {
    document.body.classList.toggle("dark-mode");
    guardarConfig();
}

function leerPagina() {
    
    if (speechSynthesis.speaking) return;

    let texto = document.body.innerText.substring(0, 5000);

    let vozActiva = new SpeechSynthesisUtterance(texto);

    speechSynthesis.speak(vozActiva);
}

function detenerLectura() {
    speechSynthesis.cancel();
}
function mayusculas() {
    document.body.classList.toggle("mayusculas");
    guardarConfig();
}

function resetEstilos() {
    document.body.classList.remove("dark-mode", "mayusculas");
    resetTamañoTexto();
    localStorage.removeItem("configAccesibilidad");
}
function guardarConfig() {

    localStorage.setItem("configAccesibilidad", JSON.stringify({
        oscuro: document.body.classList.contains("dark-mode"),
        mayuscula: document.body.classList.contains("mayusculas"),
        aumentarTexto: document.body.classList.contains("aumentarTexto"),
        disminuirTexto: document.body.classList.contains("disminuirTexto")
    }));

}
