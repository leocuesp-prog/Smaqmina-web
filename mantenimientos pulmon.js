
let mantenimiento4=JSON.parse(localStorage.getItem("mantenimiento4"))||[]
let tabla4=document.getElementById("tableman4")
const usuarioActivo = localStorage.getItem("usuarioActivo");
let accion=document.getElementById("accion")
function guardar5(){
    localStorage.setItem("mantenimiento4",JSON.stringify(mantenimiento4))
}
function cargetable4(){
    tabla4.innerHTML = "";
    for( let a=0; a<mantenimiento4.length;a++){
        let fila=tabla4.insertRow()
        fila.insertCell(0).innerText = a + 1;
        let tipo_manCell = fila.insertCell(1);
        tipo_manCell.innerText = mantenimiento4[a].tipo_mantenimiento;
        let fechaCell = fila.insertCell(2);
        fechaCell.innerText = mantenimiento4[a].fecha;
        let observacionCell = fila.insertCell(3);
        observacionCell.innerText = mantenimiento4[a].observacion;
        let eq_apCell = fila.insertCell(4);
        eq_apCell.innerText = mantenimiento4[a].equipo_apto;
        let realizoCell = fila.insertCell(5);
        realizoCell.innerText = mantenimiento4[a].realizo_mantenimiento;
        let revisoCell = fila.insertCell(6);
        revisoCell.innerText = mantenimiento4[a].reviso_Mantenimiento;
        let novedadCell = fila.insertCell(7);
        novedadCell.innerText = mantenimiento4[a].novedad;
        if(usuarioActivo){
        let celdaAccion = fila.insertCell(8);
        let botonModificar = document.createElement("button");
        botonModificar.innerText = "✏️";
        botonModificar.style.backgroundColor="white";
        botonModificar.addEventListener("click", function(){
            let nuevotipo = prompt("Nuevo tipo mantenimiento:", mantenimiento4[a].tipo_mantenimiento);
            let nuevafecha = prompt("Nueva fecha:", mantenimiento4[a].fecha);
            let nuevoobservacion = prompt("Nueva observacion:", mantenimiento4[a].observacion);
            let nuevoeq = prompt("equipo apto:", mantenimiento4[a].equipo_apto);
            let nuevorealizo = prompt("Realizo mantenimiento:", mantenimiento4[a].realizo_mantenimiento);
            let nuevoreviso = prompt("Reviso mantenimiento:", mantenimiento4[a].reviso_Mantenimiento);
            let nuevonovedad = prompt("Nueva novedad:", mantenimiento4[a].novedad);
            if(nuevotipo !== null){
                mantenimiento4[a].tipo_mantenimiento = nuevotipo;
                mantenimiento4[a].fecha = nuevafecha;
                mantenimiento4[a].observacion = nuevoobservacion;
                mantenimiento4[a].equipo_apto = nuevoeq;
                mantenimiento4[a].realizo_mantenimiento=nuevorealizo
                mantenimiento4[a].reviso_Mantenimiento=nuevoreviso
                mantenimiento4[a].novedad=nuevonovedad
            }
            guardar5();
            cargetable4();
        });
        celdaAccion.appendChild(botonModificar);
        let botonEliminar = document.createElement("button");
        botonEliminar.innerText = "🗑️";
        botonEliminar.style.backgroundColor = "white";
        botonEliminar.addEventListener("click", function(){
            mantenimiento4.splice(a, 1);
            guardar5();
            cargetable4();
        });
        celdaAccion.appendChild(botonEliminar);
    }else{
        accion.style.display="none"
    }
    }
}
cargetable4()
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


