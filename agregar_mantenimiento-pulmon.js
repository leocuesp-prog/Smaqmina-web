
function guardar5(){// pulmon
    let tipo_mantenimiento=document.getElementById("tipo_mantenimiento").value
    let fecha=document.getElementById("Fecha mantenimiento").value
    let observacion=document.getElementById("Observacion").value
    let equipo_apto=document.getElementById("Equipo apto").value
    let realizo_mantenimiento=document.getElementById("Realizo mantenimiento").value
    let reviso_Mantenimiento=document.getElementById("Reviso Mantenimiento").value
    let novedad=document.getElementById("Novedad").value
    let mantenimiento4=JSON.parse(localStorage.getItem("mantenimiento4")) || []
    mantenimiento4.push({
        tipo_mantenimiento,
        fecha,
        observacion,
        equipo_apto,
        realizo_mantenimiento,
        reviso_Mantenimiento,
        novedad
    })
        if (equipo_apto==="equipo apto"|| tipo_mantenimiento==="tipo mantenimiento"){
        alert("Datos incorrectos")
        return
    }
    localStorage.setItem("mantenimiento4",JSON.stringify(mantenimiento4))
    alert("Guardado correctamente")
    document.getElementById("tipo_mantenimiento").value = "";
    document.getElementById("Fecha mantenimiento").value = "";
    document.getElementById("Observacion").value = "";
    document.getElementById("Equipo apto").value = "";
    document.getElementById("Realizo mantenimiento").value = "";
    document.getElementById("Reviso Mantenimiento").value = "";
    document.getElementById("Novedad").value = "";
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