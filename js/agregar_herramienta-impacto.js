function guardar(){

    let nombre = document.getElementById("Nombre").value;

    let bueno = parseInt(document.getElementById("Cantidad_buena").value) || 0;
    let regular = parseInt(document.getElementById("Cantidad_regular").value) || 0;
    let malo = parseInt(document.getElementById("Cantidad_mala").value) || 0;

    let herramientas2 = JSON.parse(localStorage.getItem("herramientas2")) || [];
    let existe = herramientas2.some(function(herramienta){
        return herramienta.nombre.toLowerCase() === nombre.toLowerCase();
    });

    if(existe){
        alert("❌ Esa herramienta ya está registrada");
        return; // Detiene la ejecución aquí
    }
        if(bueno<0||malo<0||regular<0){
        alert("datos incorrectos")
        return
    }
    if  (nombre===""){
        alert ("Ingrese los datos")
        return

    }
    let nueva = {
        nombre: nombre,
        bueno: bueno,
        regular: regular,
        malo: malo,
        estado: "Bueno" // estado inicial
    };

    herramientas2.push(nueva);

    localStorage.setItem("herramientas2", JSON.stringify(herramientas2));

    alert("Guardado correctamente");
        document.getElementById("Nombre").value = "";
    document.getElementById("Cantidad_buena").value = "";
    document.getElementById("Cantidad_regular").value = "";
    document.getElementById("Cantidad_mala").value = "";
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