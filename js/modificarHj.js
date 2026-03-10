
document.addEventListener("DOMContentLoaded", function () {

    // 1️⃣ CONTROL DE LÁPICES
    const lapices = document.querySelectorAll(".icon"); // todos los botones de edición
    const usuarioActivo = localStorage.getItem("usuarioActivo");

    if (usuarioActivo) {
        lapices.forEach(btn => btn.style.display = "inline-block"); // mostrar lápices
    } else {
        lapices.forEach(btn => btn.style.display = "none"); // ocultar lápices
    }



});


// Espera a que la página cargue completamente
document.addEventListener("DOMContentLoaded", function () {

    // Selecciona TODOS los botones con clase "icon"
    let botones = document.querySelectorAll(".icon");

    // Recorre cada botón
    for (let i = 0; i < botones.length; i++) {

        // Agrega evento click a cada botón
        botones[i].addEventListener("click", function () {

            // Busca el <main> más cercano al botón presionado
            let contenedor = this.parentElement;

            // Selecciona todos los <span> dentro de ese main
            let campos = contenedor.querySelectorAll("span");

            // Recorre cada campo encontrado
            for (let j = 0; j < campos.length; j++) {

                // Obtiene el id del campo
                let idCampo = campos[j].id;

                // Si el campo no tiene id, lo ignora
                if (idCampo === "") {
                    continue;
                }

                // Busca el texto del <strong> que está en el mismo <li>
                let etiqueta = campos[j].parentElement.querySelector("strong").innerText;

                // Pide el nuevo valor mostrando el nombre del campo
                let nuevoValor = prompt("Editar " + etiqueta, campos[j].innerText);

                // Si el usuario no cancela
                if (nuevoValor !== null) {

                    // Cambia el texto del campo
                    campos[j].innerText = nuevoValor;

                    // Guarda el nuevo valor en localStorage usando el id como clave
                    localStorage.setItem(idCampo, nuevoValor);
                }
            }
        });
    }

    // -------- CARGAR DATOS GUARDADOS --------

    // Selecciona todos los span de la página
    let todosLosSpans = document.querySelectorAll("span");

    // Recorre cada span
    for (let k = 0; k < todosLosSpans.length; k++) {

        // Obtiene el id del span
        let id = todosLosSpans[k].id;

        // Si no tiene id lo ignora
        if (id === "") {
            continue;
        }

        // Busca si existe un valor guardado en localStorage
        let valorGuardado = localStorage.getItem(id);

        // Si existe un valor guardado
        if (valorGuardado !== null) {

            // Lo coloca en el span
            todosLosSpans[k].innerText = valorGuardado;
        }
    }

});






window.addEventListener("load", function () {
    if (localStorage.getItem("fotoPerfil")) {
        const icono = document.getElementById("iconoNavbar");
        if (icono) icono.src = localStorage.getItem("fotoPerfil");
    }
});
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






