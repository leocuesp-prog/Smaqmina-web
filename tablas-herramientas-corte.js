// ===============================
// OBTENER DATOS
// ===============================


let herramientas = JSON.parse(localStorage.getItem("herramientas")) || [];
let tabla = document.getElementById("tabladatos");
let encabezadoAccion = document.getElementById("accion");
const usuarioActivo = localStorage.getItem("usuarioActivo");

// ===============================
// GUARDAR EN LOCALSTORAGE
// ===============================

function guardar() {
    localStorage.setItem("herramientas", JSON.stringify(herramientas));
}

// ===============================
// CARGAR TABLA
// ===============================

function cargarTabla() {

    tabla.innerHTML = "";

    // Ocultar columna acción si NO hay usuario activo
    if (!usuarioActivo && encabezadoAccion) {
        encabezadoAccion.style.display = "none";
    }

    for (let i = 0; i < herramientas.length; i++) {

        let fila = tabla.insertRow();

        // Código
        fila.insertCell(0).innerText = i + 1;

        // Nombre
        fila.insertCell(1).innerText = herramientas[i].nombre;

        // Cantidad (por defecto BUENO)
        let cantidadCell = fila.insertCell(2);
        cantidadCell.innerText = herramientas[i].bueno;

        // ===============================
        // SELECT ESTADO
        // ===============================

        let celdaEstado = fila.insertCell(3);

        let select = document.createElement("select");
        let estados = ["Bueno", "Regular", "Malo"];

        estados.forEach(function (estado) {
            let option = document.createElement("option");
            option.value = estado;
            option.text = estado;
            select.appendChild(option);
        });

        select.addEventListener("change", function () {

            if (select.value === "Bueno") {
                cantidadCell.innerText = herramientas[i].bueno;
            }
            if (select.value === "Regular") {
                cantidadCell.innerText = herramientas[i].regular;
            }
            if (select.value === "Malo") {
                cantidadCell.innerText = herramientas[i].malo;
            }
        });

        celdaEstado.appendChild(select);

        // ===============================
        // BOTONES (SOLO SI HAY USUARIO)
        // ===============================

        if (usuarioActivo) {

            let celdaAccion = fila.insertCell(4);

            // -------- MODIFICAR --------

            let botonModificar = document.createElement("button");
            botonModificar.innerText = "✏️";
            botonModificar.style.backgroundColor = "white";

            botonModificar.addEventListener("click", function () {

                let nuevoNombre = prompt("Nuevo nombre:", herramientas[i].nombre);
                let nuevoBueno = prompt("Cantidad Bueno:", herramientas[i].bueno);
                let nuevoRegular = prompt("Cantidad Regular:", herramientas[i].regular);
                let nuevoMalo = prompt("Cantidad Malo:", herramientas[i].malo);

                if (nuevoNombre !== null) {

                    herramientas[i].nombre = nuevoNombre;
                    herramientas[i].bueno = parseInt(nuevoBueno) || 0;
                    herramientas[i].regular = parseInt(nuevoRegular) || 0;
                    herramientas[i].malo = parseInt(nuevoMalo) || 0;

                    guardar();
                    cargarTabla();
                }
            });

            celdaAccion.appendChild(botonModificar);

            // -------- ELIMINAR --------

            let botonEliminar = document.createElement("button");
            botonEliminar.innerText = "🗑️";
            botonEliminar.style.backgroundColor = "white";

            botonEliminar.addEventListener("click", function () {

                if (confirm("¿Seguro que deseas eliminar esta herramienta?")) {
                    herramientas.splice(i, 1);
                    guardar();
                    cargarTabla();
                }
            });

            celdaAccion.appendChild(botonEliminar);
        }
    }
}

// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", function () {
    cargarTabla();
});
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

