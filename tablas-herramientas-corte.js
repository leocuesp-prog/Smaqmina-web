let tabla = document.getElementById("tabladatos");
const usuarioActivo = localStorage.getItem("usuarioActivo");
let accion = document.getElementById("accion");

function cargarTabla() {

    fetch("http://localhost:3000/herramientas/corte")
        .then(res => res.json())
        .then(herramientas => {

            tabla.innerHTML = "";

            herramientas.forEach((herramienta, i) => {

                let fila = tabla.insertRow();

                fila.insertCell(0).innerText = i + 1;

                let nombreCell = fila.insertCell(1);
                nombreCell.innerText = herramienta.nombre_herramienta_corte;

                let cantidadCell = fila.insertCell(2);
                cantidadCell.innerText = herramienta.cantidad_buena_corte;

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
                        cantidadCell.innerText = herramienta.cantidad_buena_corte;
                    }
                    if (select.value === "Regular") {
                        cantidadCell.innerText = herramienta.cantidad_regular_corte;
                    }
                    if (select.value === "Malo") {
                        cantidadCell.innerText = herramienta.cantidad_mala_corte;
                    }
                });

                celdaEstado.appendChild(select);

                // ACCIONES SOLO SI HAY USUARIO
                if (usuarioActivo) {

                    let celdaAccion = fila.insertCell(4);

                    let botonEliminar = document.createElement("button");
                    botonEliminar.innerText = "🗑️";

                    botonEliminar.addEventListener("click", function () {

                        fetch(`http://localhost:3000/eliminar-herramienta/${herramienta.id_herramienta_corte}`, {
                            method: "DELETE"
                        })
                            .then(res => res.json())
                            .then(() => cargarTabla());
                    });

                    celdaAccion.appendChild(botonEliminar);

                } else {
                    accion.style.display = "none";
                }

            });

        })
        .catch(error => console.error("Error:", error));
}

cargarTabla();
// ===============================
// MENÚ ACCESIBILIDAD
// ===============================

let menu = document.getElementById("menuAccesibilidad");
let boton = document.getElementById("botonAccesibilidad");

boton.addEventListener("click", () => {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
});

// ===============================
// FUNCIONES ACCESIBILIDAD
// ===============================

function toggleOscuro() {
    document.body.classList.toggle("dark-mode");
    guardarConfig();
}

function toggleContraste() {
    document.body.classList.toggle("alto-contraste");
    guardarConfig();
}

function mayusculas() {
    document.body.classList.toggle("mayusculas");
    guardarConfig();
}

function resetEstilos() {
    document.body.classList.remove("dark-mode", "alto-contraste", "mayusculas");
    localStorage.removeItem("configAccesibilidad");
}

function leerPagina() {
    if (speechSynthesis.speaking) return;

    let texto = document.body.innerText;
    let vozActiva = new SpeechSynthesisUtterance(texto);
    speechSynthesis.speak(vozActiva);
}

function detenerLectura() {
    speechSynthesis.cancel();
}

// ===============================
// GUARDAR CONFIGURACIÓN
// ===============================

function guardarConfig() {
    localStorage.setItem("configAccesibilidad", JSON.stringify({
        oscuro: document.body.classList.contains("dark-mode"),
        contraste: document.body.classList.contains("alto-contraste"),
        mayuscula: document.body.classList.contains("mayusculas"),
    }));
}

// ===============================
// CARGAR CONFIGURACIÓN
// ===============================

window.onload = function () {

    let config = JSON.parse(localStorage.getItem("configAccesibilidad"));

    if (config) {
        if (config.oscuro) document.body.classList.add("dark-mode");
        if (config.contraste) document.body.classList.add("alto-contraste");
        if (config.mayuscula) document.body.classList.add("mayusculas");
    }
};

