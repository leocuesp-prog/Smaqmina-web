function guardar2(){// Función que guarda los datos del mantenimiento de la electrobomba
    let tipo_mantenimiento=document.getElementById("tipo_mantenimiento").value // Obtiene el valor del tipo de mantenimiento desde el input
    let fecha=document.getElementById("Fecha mantenimiento").value // Obtiene la fecha ingresada
    let observacion=document.getElementById("Observacion").value // Obtiene la observación escrita por el usuario
    let equipo_apto=document.getElementById("Equipo apto").value // Obtiene si el equipo quedó apto o no
    let realizo_mantenimiento=document.getElementById("Realizo mantenimiento").value // Obtiene el nombre de quien realizó el mantenimiento
    let reviso_Mantenimiento=document.getElementById("Reviso Mantenimiento").value // Obtiene el nombre de quien revisó el mantenimiento
    let novedad=document.getElementById("Novedad").value // Obtiene la novedad ingresada
    let mantenimiento1=JSON.parse(localStorage.getItem("mantenimiento1")) || [] // Obtiene los datos guardados en localStorage o crea un arreglo vacío si no hay datos
    mantenimiento1.push({ // Agrega un nuevo objeto con los datos ingresados al arreglo
        tipo_mantenimiento, // Guarda el tipo de mantenimiento dentro del objeto
        fecha, // Guarda la fecha dentro del objeto
        observacion, // Guarda la observación dentro del objeto
        equipo_apto, // Guarda el estado del equipo dentro del objeto
        realizo_mantenimiento, // Guarda quién realizó el mantenimiento
        reviso_Mantenimiento, // Guarda quién revisó el mantenimiento
        novedad // Guarda la novedad registrada
    }) // Cierra el objeto y el push
        if (equipo_apto==="equipo apto"|| tipo_mantenimiento==="tipo mantenimiento"){
        alert("Datos incorrectos")
        return
    }
    localStorage.setItem("mantenimiento1",JSON.stringify(mantenimiento1)) // Guarda el arreglo actualizado en localStorage en formato JSON
    alert("Guardado correctamente") // Muestra un mensaje de confirmación
    document.getElementById("tipo_mantenimiento").value = ""; // Limpia el campo tipo de mantenimiento
    document.getElementById("Fecha mantenimiento").value = ""; // Limpia el campo fecha
    document.getElementById("Observacion").value = ""; // Limpia el campo observación
    document.getElementById("Equipo apto").value = ""; // Limpia el campo equipo apto
    document.getElementById("Realizo mantenimiento").value = ""; // Limpia el campo realizó mantenimiento
    document.getElementById("Reviso Mantenimiento").value = ""; // Limpia el campo revisó mantenimiento
    document.getElementById("Novedad").value = ""; // Limpia el campo novedad

} // Cierra la función
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