function guardarDatos() {

    let wb = XLSX.utils.book_new();

    // 🔷 Estructura tipo tu tabla real
    let datos = [

        ["TRAMO A EVALUAR", "", "CRITERIO DE AVALUACIÓN", "", "", "", "", "", "", "", ""],

        ["", "ELEMENTO A EVALUAR",
            "DETERIORO FÍSICO", "", "",
            "DETERIORO BIOLÓGICO", "", "", "", "",
            "ALTURA <1.8m", "SECCIÓN <3m²"
        ],

        ["", "",
            "Roturas", "Astilam", "Desplazamiento",
            "Hongos", "Moho", "Presencia", "Humedad", "Putrefacción",
            "", ""
        ]
    ];

    // 🔹 Obtener datos reales
    let tabla = document.querySelectorAll(".tabla-Mantenimientos")[0];
    let filas = tabla.querySelectorAll("tr");

    filas.forEach(fila => {
        let celdas = fila.querySelectorAll("td");

        if (celdas.length > 0) {

            let elemento = celdas[1]?.innerText.trim();
            let selects = fila.querySelectorAll("select");

            if (elemento && selects.length > 0) {

                let filaDatos = ["", elemento];

                selects.forEach(sel => {
                    filaDatos.push(sel.value === "Si" ? "SI" : "NO");
                });

                datos.push(filaDatos);
            }
        }
    });

    let ws = XLSX.utils.aoa_to_sheet(datos);

    // 🔥 COMBINACIONES (CLAVE PARA QUE SE VEA COMO TU TABLA)
    ws["!merges"] = [

        // Título principal
        { s: { r: 0, c: 2 }, e: { r: 0, c: 10 } },

        // Tramo evaluar
        { s: { r: 0, c: 0 }, e: { r: 2, c: 0 } },

        // Elemento evaluar
        { s: { r: 1, c: 1 }, e: { r: 2, c: 1 } },

        // Deterioro físico
        { s: { r: 1, c: 2 }, e: { r: 1, c: 4 } },

        // Deterioro biológico
        { s: { r: 1, c: 5 }, e: { r: 1, c: 9 } },

        // Altura
        { s: { r: 1, c: 10 }, e: { r: 2, c: 10 } },

        // Sección
        { s: { r: 1, c: 11 }, e: { r: 2, c: 11 } }
    ];

    // 🔥 Tamaño columnas
    ws["!cols"] = [
        { wch: 18 },
        { wch: 20 },
        { wch: 10 }, { wch: 10 }, { wch: 15 },
        { wch: 10 }, { wch: 10 }, { wch: 12 },
        { wch: 10 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }
    ];

    // 🎨 Estilos
    function estilo(fondo, texto = "FFFFFF", negrita = false) {
        return {
            fill: { fgColor: { rgb: fondo } },
            font: { bold: negrita, color: { rgb: texto } },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" }
            }
        };
    }

    let rango = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = 0; R <= rango.e.r; ++R) {
        for (let C = 0; C <= rango.e.c; ++C) {

            let ref = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[ref]) continue;

            let valor = ws[ref].v;

            // 🔷 Encabezados
            if (R <= 2) {
                ws[ref].s = estilo("0B2C3D", "FFFFFF", true);
            }

            // 🔷 Datos
            else {
                if (valor === "SI") {
                    ws[ref].s = estilo("C6EFCE", "006100", true);
                } else if (valor === "NO") {
                    ws[ref].s = estilo("FFC7CE", "9C0006", true);
                } else {
                    ws[ref].s = estilo("FFFFFF", "000000");
                }
            }
        }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Sostenimiento");

    XLSX.writeFile(wb, "Sostenimiento_PRO.xlsx");
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

