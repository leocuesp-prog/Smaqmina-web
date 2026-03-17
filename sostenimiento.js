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

