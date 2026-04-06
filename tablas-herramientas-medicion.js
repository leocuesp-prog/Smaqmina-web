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
    if (tamañoActual < 22) {
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
