

// Selecciona el elemento de entrada (input) del buscador por su ID
const buscador = document.getElementById("buscador");

// Verifica si el buscador existe en la página actual para evitar errores
if (buscador) {

    // Selecciona todas las filas (tr) dentro del cuerpo (tbody) de la tabla de equipos
    const filas = document.querySelectorAll(".tabla-equipos tbody tr");

    // Escucha el evento "keyup" (cuando el usuario suelta una tecla al escribir)
    buscador.addEventListener("keyup", function () {

        // Convierte el texto ingresado a minúsculas para una búsqueda insensible a mayúsculas
        const texto = buscador.value.toLowerCase();

        // Recorre cada fila de la tabla
        filas.forEach(function (fila) {

            // Obtiene el contenido de la primera celda (td) y lo pasa a minúsculas
            const nombre = fila.querySelector("td").textContent.toLowerCase();

            // Si el nombre contiene el texto buscado...
            if (nombre.includes(texto)) {
                fila.style.display = ""; // Muestra la fila (estilo por defecto)
            } else {
                fila.style.display = "none"; // Oculta la fila
            }

        });
    });
}



// Función para mostrar la ventana emergente (overlay) del perfil
function abrirPerfil() {
    const overlay = document.getElementById("perfilOverlay");
    // Cambia el display a "flex" para centrar el contenido y hacerlo visible
    if (overlay) overlay.style.display = "flex";
}

// Función para ocultar la ventana emergente del perfil
function cerrarPerfil() {
    const overlay = document.getElementById("perfilOverlay");
    if (overlay) overlay.style.display = "none";
}


// Función que prepara y muestra el formulario de edición con los datos actuales
function abrirEditarPerfil() {

    const editarOverlay = document.getElementById("editarOverlay");
    if (!editarOverlay) return; // Si no existe el elemento, sale de la función

    editarOverlay.style.display = "flex"; // Muestra el modal de edición

    // Toma el texto actual de las etiquetas del perfil y lo pone dentro de los cuadros de texto (inputs)
    document.getElementById("inputNombre").value = document.getElementById("nombrePerfil").textContent;
    document.getElementById("inputRol").value = document.getElementById("rolPerfil").textContent;
    document.getElementById("inputCorreo").value = document.getElementById("correoPerfil").textContent;
    document.getElementById("inputExtension").value = document.getElementById("extensionPerfil").textContent;
    document.getElementById("inputDepto").value = document.getElementById("deptoPerfil").textContent;
}

// Cierra el modal de edición
function cerrarEditar() {
    const editarOverlay = document.getElementById("editarOverlay");
    if (editarOverlay) editarOverlay.style.display = "none";
}




// Función para guardar los cambios tanto en la pantalla como en la memoria del navegador (localStorage)
function guardarPerfil() {

    // Actualiza el texto visual en la página con los nuevos valores de los inputs
    document.getElementById("nombrePerfil").textContent = document.getElementById("inputNombre").value;
    document.getElementById("rolPerfil").textContent = document.getElementById("inputRol").value;
    document.getElementById("correoPerfil").textContent = document.getElementById("inputCorreo").value;
    document.getElementById("extensionPerfil").textContent = document.getElementById("inputExtension").value;
    document.getElementById("deptoPerfil").textContent = document.getElementById("inputDepto").value;

    // Obtiene el archivo de imagen seleccionado (si el usuario eligió uno)
    const file = document.getElementById("inputFoto").files[0];

    if (file) {
        const reader = new FileReader(); // Objeto para leer archivos

        // Define qué pasa cuando la imagen termine de leerse
        reader.onload = function (e) {
            // Actualiza la imagen en el perfil (overlay)
            document.getElementById("fotoPerfil").src = e.target.result;
            // Actualiza la imagen en la barra de navegación (navbar)
            document.getElementById("iconoNavbar").src = e.target.result;
            // Guarda la imagen en formato de texto largo (Base64) en localStorage
            localStorage.setItem("fotoPerfil", e.target.result);
        };

        // Inicia la lectura de la imagen
        reader.readAsDataURL(file);
    }

    // Guarda todos los datos de texto en el almacenamiento local del navegador
    localStorage.setItem("nombrePerfil", document.getElementById("inputNombre").value);
    localStorage.setItem("rolPerfil", document.getElementById("inputRol").value);
    localStorage.setItem("correoPerfil", document.getElementById("inputCorreo").value);
    localStorage.setItem("extensionPerfil", document.getElementById("inputExtension").value);
    localStorage.setItem("deptoPerfil", document.getElementById("inputDepto").value);

    alert("Perfil actualizado correctamente ✅");
    cerrarEditar(); // Cierra el modal tras guardar
}




// Se ejecuta cada vez que la página termina de cargar completamente
window.addEventListener("load", function () {

    const usuarioGuardado = localStorage.getItem("usuarioActivo");

    if (!usuarioGuardado) {
        // Si no hay sesión, lo mandamos al login
        window.location.href = "index.html";
        return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    // Mostrar nombre en perfil
    document.getElementById("nombrePerfil").textContent = usuario.nombre;

    // Mostrar correo
    document.getElementById("correoPerfil").textContent = usuario.correo;

    // Si tienes teléfono en tu base de datos
    if (usuario.telefono) {
        document.getElementById("extensionPerfil").textContent = usuario.telefono;
    }

    // Mostrar también el nombre en el navbar si quieres
    const linkLogin = document.getElementById("linkLogin");
    const perfilNavbar = document.getElementById("perfilNavbar");

    if (linkLogin) linkLogin.style.display = "none";
    if (perfilNavbar) perfilNavbar.style.display = "block";

});




document.addEventListener("DOMContentLoaded", function () {

    // Selecciona todos los carruseles que existan en la página
    const carousels = document.querySelectorAll(".carousel");

    if (carousels.length === 0) return; // Si no hay carruseles, no hace nada

    carousels.forEach(carousel => {
        // El "track" es el contenedor que se desliza
        const track = carousel.querySelector(".carousel-track");
        const images = carousel.querySelectorAll("img");

        let index = 0; // Índice de la imagen actual

        // Función que mueve el carrusel a la siguiente imagen
        function moveCarousel() {
            // Aumenta el índice; si llega al final, vuelve a 0
            index = (index + 1) % images.length;
            // Desplaza el track horizontalmente un 100% por cada índice
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        // Ejecuta la función moveCarousel automáticamente cada 4000ms (4 segundos)
        setInterval(moveCarousel, 4000);
    });
});




document.addEventListener("DOMContentLoaded", function () {

    // Selecciona todas las tarjetas de categoría
    const cards = document.querySelectorAll(".categoria-card");

    if (cards.length === 0) return;

    cards.forEach(card => {
        // Define el tiempo de la animación de transición
        card.style.transition = "0.3s";

        // Al pasar el mouse: aumenta el tamaño un 5%
        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.05)";
        });

        // Al quitar el mouse: vuelve al tamaño original
        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
        });
    });
});




window.addEventListener("load", function () {

    // Revisa si existe un usuario activo en el almacenamiento local
    const usuario = localStorage.getItem("usuarioActivo");

    const linkLogin = document.getElementById("linkLogin");
    const perfilNavbar = document.getElementById("perfilNavbar");

    if (usuario) {
        // ✅ Si hay sesión: oculta el botón de "Login" y muestra el menú de "Perfil"
        if (linkLogin) linkLogin.style.display = "none";
        if (perfilNavbar) perfilNavbar.style.display = "block";
    } else {
        // ❌ Si no hay sesión: muestra el botón de "Login" y oculta el "Perfil"
        if (linkLogin) linkLogin.style.display = "block";
        if (perfilNavbar) perfilNavbar.style.display = "none";
    }
});

// Función para cerrar la sesión del usuario
function cerrarSesion() {
    // ❌ Elimina la marca de usuario activo del almacenamiento
    localStorage.removeItem("usuarioActivo");

    alert("Sesión cerrada correctamente 👋");

    // Redirige al usuario a la página de inicio (Login)
    window.location.href = "index.html";
}
let menu = document.getElementById("menuAccesibilidad");
let boton = document.getElementById("botonAccesibilidad");

/* Abrir / cerrar menú */
boton.addEventListener("click", () => {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
});

/* FUNCIONES */

function toggleOscuro(){
    document.body.classList.toggle("dark-mode");
    guardarConfig();
}

function toggleContraste(){
    document.body.classList.toggle("alto-contraste");
    guardarConfig();
}


function mayusculas(){
    document.body.classList.toggle("mayusculas");
    guardarConfig();
}

function resetEstilos(){
    document.body.classList.remove("dark-mode", "alto-contraste", "mayusculas");
    localStorage.removeItem("configAccesibilidad");
}
function leerPagina(){
    if (speechSynthesis.speaking) return;

    let texto = document.body.innerText;
    vozActiva = new SpeechSynthesisUtterance(texto);

    speechSynthesis.speak(vozActiva);
}
function detenerLectura() {
    speechSynthesis.cancel();
}
/* GUARDAR CONFIGURACIÓN */

function guardarConfig(){
    localStorage.setItem("configAccesibilidad", JSON.stringify({
        oscuro: document.body.classList.contains("dark-mode"),
        contraste: document.body.classList.contains("alto-contraste"),
        mayuscula: document.body.classList.contains("mayusculas"),
    }));
}

/* CARGAR CONFIGURACIÓN */

window.onload = function(){
    let config = JSON.parse(localStorage.getItem("configAccesibilidad"));

    if(config){
        if(config.oscuro) document.body.classList.add("dark-mode");
        if(config.contraste) document.body.classList.add("alto-contraste");
        if(config.mayuscula) document.body.classList.add("mayusculas");
    }
}

function borrarFoto() {

    // Imagen por defecto
    const imagenDefault = "imagenes/Usuario.webp";

    // Cambiar imagen en perfil
    document.getElementById("fotoPerfil").src = imagenDefault;

    // Cambiar imagen en navbar
    document.getElementById("iconoNavbar").src = imagenDefault;

    // Borrar del localStorage
    localStorage.removeItem("fotoPerfil");

    alert("Foto eliminada correctamente 🗑️");
}