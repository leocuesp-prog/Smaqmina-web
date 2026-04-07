// =============================
// ACCESIBILIDAD - ARCHIVO COMPARTIDO
// =============================

// Cargar configuración almacenada al cargar la página
window.addEventListener("load", function () {
    let config = JSON.parse(localStorage.getItem("configAccesibilidad"));

    if (config) {
        if (config.oscuro) document.body.classList.add("dark-mode");
        if (config.contraste) document.body.classList.add("alto-contraste");
        if (config.mayuscula) document.body.classList.add("mayusculas");
    }

    // Cargar tamaño de texto guardado
    let tamañoGuardado = localStorage.getItem("tamañoTexto");
    if (tamañoGuardado) {
        document.body.style.fontSize = tamañoGuardado + "px";
    }
});

// Inicializar menú de accesibilidad
let menu = document.getElementById("menuAccesibilidad");
let boton = document.getElementById("botonAccesibilidad");

if (menu && boton) {
    boton.addEventListener("click", () => {
        menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    });
}

let tamañoActual = localStorage.getItem("tamañoTexto") || 16;
document.body.style.fontSize = tamañoActual + "px";

// Funciones de tamaño de texto
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

// Modo oscuro
function toggleOscuro() {
    document.body.classList.toggle("dark-mode");
    guardarConfig();
}

// Lectura de página
function leerPagina() {
    if (speechSynthesis.speaking) return;

    let texto = document.body.innerText.substring(0, 5000);
    let vozActiva = new SpeechSynthesisUtterance(texto);
    
    // Configurar idioma español
    vozActiva.lang = 'es-ES';
    
    speechSynthesis.speak(vozActiva);
}

function detenerLectura() {
    speechSynthesis.cancel();
}

// Mayúsculas
function mayusculas() {
    document.body.classList.toggle("mayusculas");
    guardarConfig();
}

// Restaurar estilos por defecto
function resetEstilos() {
    document.body.classList.remove("dark-mode", "mayusculas");
    resetTamañoTexto();
    localStorage.removeItem("configAccesibilidad");
}

// Guardar configuración en localStorage
function guardarConfig() {
    localStorage.setItem("configAccesibilidad", JSON.stringify({
        oscuro: document.body.classList.contains("dark-mode"),
        mayuscula: document.body.classList.contains("mayusculas"),
        }));
}
function closeMenu() {
    let menu = document.getElementById("menuAccesibilidad");
    if (menu) menu.style.display = "none";
}

function openMenu() {
    let menu = document.getElementById("menuAccesibilidad");
    if (menu) menu.style.display = "flex";
}

// En el botón que abre el menú, detén la propagación
document.getElementById("botonAccesibilidad").addEventListener("click", function (e) {
    e.stopPropagation(); // evita que el clic llegue al document y cierre el menú
    openMenu();
});

// Cierra solo si el clic fue fuera del menú
document.addEventListener("click", function (e) {
    let menu = document.getElementById("menuAccesibilidad");
    if (menu && menu.style.display === "flex" && !menu.contains(e.target)) {
        closeMenu();
    }
});