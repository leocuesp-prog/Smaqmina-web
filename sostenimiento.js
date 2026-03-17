function guardarDatos() {

    let datos = [];

    // 🔥 ENCABEZADOS PRINCIPALES (tabla 1)
    datos.push([
        "Elemento",
        "Roturas",
        "Astilam",
        "Desplazamiento",
        "Hongos",
        "Moho",
        "Presencia",
        "Humedad",
        "Putrefacción",
        "Altura <1.8m",
        "Sección <3m²"
    ]);

    // 🔹 FILAS DE LA PRIMERA TABLA
    let filas = document.querySelectorAll(".tabla-Mantenimientos:first-of-type tr");

    filas.forEach(fila => {
        let celdas = fila.querySelectorAll("td");

        if (celdas.length > 0) {

            let elemento = celdas[1]?.innerText.trim();
            let selects = fila.querySelectorAll("select");

            if (elemento && selects.length > 0) {
                let filaDatos = [elemento];

                selects.forEach(sel => {
                    filaDatos.push(sel.options[sel.selectedIndex].text);
                });

                datos.push(filaDatos);
            }
        }
    });

    // 🔥 ESPACIO ENTRE TABLAS
    datos.push([]);
    datos.push(["HALLAZGOS DE INSPECCION"]);

    // 🔥 ENCABEZADOS TABLA 2
    datos.push(["Zona", "Medida de intervención", "Fecha"]);

    // 🔹 SEGUNDA TABLA
    let tabla2 = document.querySelectorAll(".tabla-Mantenimientos")[1];
    let filas2 = tabla2.querySelectorAll("tr");

    filas2.forEach(fila => {
        let inputs = fila.querySelectorAll("input");

        if (inputs.length === 3) {
            let zona = inputs[0].value;
            let medida = inputs[1].value;
            let fecha = inputs[2].value;

            if (zona || medida || fecha) {
                datos.push([zona, medida, fecha]);
            }
        }
    });

    // 🔥 RESPONSABLE (última fila)
    let ultimaFila = tabla2.querySelectorAll("tr")[tabla2.querySelectorAll("tr").length - 1];
    let inputsFinal = ultimaFila.querySelectorAll("input, select");

    if (inputsFinal.length >= 4) {
        datos.push([]);
        datos.push([
            "Responsable",
            "Fecha intervención",
            "Fecha verificación",
            "Implementado"
        ]);

        datos.push([
            inputsFinal[0].value,
            inputsFinal[1].value,
            inputsFinal[2].value,
            inputsFinal[3].value
        ]);
    }

    descargarExcel(datos);
}


function descargarExcel(datos) {

    let contenido = "\uFEFFsep=;\n"; // 🔥 BOM para UTF-8

    datos.forEach(fila => {
        contenido += fila.join(";") + "\n";
    });

    let blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });

    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sostenimiento.csv";
    link.click();
}
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

