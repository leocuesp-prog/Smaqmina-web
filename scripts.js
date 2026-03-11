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
// PERFIL
// =============================
function abrirPerfil() {
    const overlay = document.getElementById("perfilOverlay");
    if (overlay) overlay.style.display = "flex";
}

function cerrarPerfil() {
    const overlay = document.getElementById("perfilOverlay");
    if (overlay) overlay.style.display = "none";
}

function abrirEditarPerfil() {

    const editarOverlay = document.getElementById("editarOverlay");
    if (!editarOverlay) return;

    editarOverlay.style.display = "flex";

    const nombre = document.getElementById("nombrePerfil");
    const rol = document.getElementById("rolPerfil");
    const correo = document.getElementById("correoPerfil");
    const extension = document.getElementById("extensionPerfil");
    const depto = document.getElementById("deptoPerfil");

    if (nombre) document.getElementById("inputNombre").value = nombre.textContent;
    if (rol) document.getElementById("inputRol").value = rol.textContent;
    if (correo) document.getElementById("inputCorreo").value = correo.textContent;
    if (extension) document.getElementById("inputExtension").value = extension.textContent;
    if (depto) document.getElementById("inputDepto").value = depto.textContent;
}

function cerrarEditar() {
    const editarOverlay = document.getElementById("editarOverlay");
    if (editarOverlay) editarOverlay.style.display = "none";
}

function guardarPerfil() {

    const nombre = document.getElementById("inputNombre")?.value;
    const rol = document.getElementById("inputRol")?.value;
    const correo = document.getElementById("inputCorreo")?.value;
    const extension = document.getElementById("inputExtension")?.value;
    const depto = document.getElementById("inputDepto")?.value;

    if (document.getElementById("nombrePerfil")) document.getElementById("nombrePerfil").textContent = nombre;
    if (document.getElementById("rolPerfil")) document.getElementById("rolPerfil").textContent = rol;
    if (document.getElementById("correoPerfil")) document.getElementById("correoPerfil").textContent = correo;
    if (document.getElementById("extensionPerfil")) document.getElementById("extensionPerfil").textContent = extension;
    if (document.getElementById("deptoPerfil")) document.getElementById("deptoPerfil").textContent = depto;

    const fileInput = document.getElementById("inputFoto");

    if (fileInput && fileInput.files.length > 0) {

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {

            const foto = document.getElementById("fotoPerfil");
            const icono = document.getElementById("iconoNavbar");

            if (foto) foto.src = e.target.result;
            if (icono) icono.src = e.target.result;

            localStorage.setItem("fotoPerfil", e.target.result);
        };

        reader.readAsDataURL(file);
    }

    localStorage.setItem("nombrePerfil", nombre);
    localStorage.setItem("rolPerfil", rol);
    localStorage.setItem("correoPerfil", correo);
    localStorage.setItem("extensionPerfil", extension);
    localStorage.setItem("deptoPerfil", depto);

    alert("Perfil actualizado correctamente ✅");

    cerrarEditar();
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
// CERRAR SESIÓN
// =============================
function cerrarSesion() {

    localStorage.removeItem("usuarioActivo");

    alert("Sesión cerrada correctamente 👋");

    window.location.href = "index.html";

}


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

    let texto = document.body.innerText.substring(0, 5000);

    let vozActiva = new SpeechSynthesisUtterance(texto);

    speechSynthesis.speak(vozActiva);
}

function detenerLectura() {
    speechSynthesis.cancel();
}

function guardarConfig() {

    localStorage.setItem("configAccesibilidad", JSON.stringify({
        oscuro: document.body.classList.contains("dark-mode"),
        contraste: document.body.classList.contains("alto-contraste"),
        mayuscula: document.body.classList.contains("mayusculas"),
    }));

}


// =============================
// FOTO PERFIL
// =============================
function borrarFoto() {

    const imagenDefault = "imagenes/Usuario.webp";

    const foto = document.getElementById("fotoPerfil");
    const icono = document.getElementById("iconoNavbar");

    if (foto) foto.src = imagenDefault;
    if (icono) icono.src = imagenDefault;

    localStorage.removeItem("fotoPerfil");

    alert("Foto eliminada correctamente 🗑️");

}