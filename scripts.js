// =============================
// BUSCADOR
// =============================
const buscador = document.getElementById("buscador");

if (buscador) {

    const filas = document.querySelectorAll(".tabla-equipos tbody tr");

    buscador.addEventListener("keyup", function () {

        const texto = buscador.value.toLowerCase();

        filas.forEach(function (fila) {

            const celda = fila.querySelector("td");
            if (!celda) return;

            const nombre = celda.textContent.toLowerCase();

            fila.style.display = nombre.includes(texto) ? "" : "none";

        });

    });
}






// =============================
// CARGA GENERAL (SIN BLOQUEO)
// =============================
window.addEventListener("load", function () {

    const usuarioGuardado = localStorage.getItem("usuarioActivo");

    if (usuarioGuardado) {

        const usuario = JSON.parse(usuarioGuardado);

        const nombrePerfil = document.getElementById("nombrePerfil");
        const correoPerfil = document.getElementById("correoPerfil");
        const extensionPerfil = document.getElementById("extensionPerfil");

        if (nombrePerfil) nombrePerfil.textContent = usuario.nombre;
        if (correoPerfil) correoPerfil.textContent = usuario.correo;
        if (extensionPerfil && usuario.telefono) extensionPerfil.textContent = usuario.telefono;

        const linkLogin = document.getElementById("linkLogin");
        const perfilNavbar = document.getElementById("perfilNavbar");

        if (linkLogin) linkLogin.style.display = "none";
        if (perfilNavbar) perfilNavbar.style.display = "block";
    }

    // accesibilidad
    let config = JSON.parse(localStorage.getItem("configAccesibilidad"));

    if (config) {
        if (config.oscuro) document.body.classList.add("dark-mode");
        if (config.contraste) document.body.classList.add("alto-contraste");
        if (config.mayuscula) document.body.classList.add("mayusculas");
    }

    // foto perfil
    const fotoGuardada = localStorage.getItem("fotoPerfil");
    if (fotoGuardada) {
        const foto = document.getElementById("fotoPerfil");
        const icono = document.getElementById("iconoNavbar");

        if (foto) foto.src = fotoGuardada;
        if (icono) icono.src = fotoGuardada;
    }

});


// =============================
// CARRUSEL
// =============================
document.addEventListener("DOMContentLoaded", function () {

    const carousels = document.querySelectorAll(".carousel");

    carousels.forEach(carousel => {

        const track = carousel.querySelector(".carousel-track");
        const images = carousel.querySelectorAll("img");

        if (!track || images.length === 0) return;

        let index = 0;

        function mover() {
            index = (index + 1) % images.length;
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        setInterval(mover, 4000);

    });

});


// =============================
// ACCESIBILIDAD
// =============================
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
