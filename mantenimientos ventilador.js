let mantenimiento6=JSON.parse(localStorage.getItem("mantenimiento5"))||[]
let tabla6=document.getElementById("tableman6")
const usuarioActivo = localStorage.getItem("usuarioActivo");
let accion=document.getElementById("accion")
function guardar7(){
    localStorage.setItem("mantenimiento6",JSON.stringify(mantenimiento6))
}
function cargetable6(){
    tabla6.innerHTML = "";
    for( let a=0; a<mantenimiento6.length;a++){
        let fila=tabla6.insertRow()
        fila.insertCell(0).innerText = a + 1;
        let tipo_manCell = fila.insertCell(1);
        tipo_manCell.innerText = mantenimiento6[a].tipo_mantenimiento;
        let fechaCell = fila.insertCell(2);
        fechaCell.innerText = mantenimiento6[a].fecha;
        let observacionCell = fila.insertCell(3);
        observacionCell.innerText = mantenimiento6[a].observacion;
        let eq_apCell = fila.insertCell(4);
        eq_apCell.innerText = mantenimiento6[a].equipo_apto;
        let realizoCell = fila.insertCell(5);
        realizoCell.innerText = mantenimiento6[a].realizo_mantenimiento;
        let revisoCell = fila.insertCell(6);
        revisoCell.innerText = mantenimiento6[a].reviso_Mantenimiento;
        let novedadCell = fila.insertCell(7);
        novedadCell.innerText = mantenimiento6[a].novedad;
        if(usuarioActivo){
        let celdaAccion = fila.insertCell(8);
        let botonModificar = document.createElement("button");
        botonModificar.innerText = "✏️";
        botonModificar.style.backgroundColor="white";
        botonModificar.addEventListener("click", function(){
            let nuevotipo = prompt("Nuevo tipo mantenimiento:", mantenimiento6[a].tipo_mantenimiento);
            let nuevafecha = prompt("Nueva fecha:", mantenimiento6[a].fecha);
            let nuevoobservacion = prompt("Nueva observacion:", mantenimiento6[a].observacion);
            let nuevoeq = prompt("equipo apto:", mantenimiento6[a].equipo_apto);
            let nuevorealizo = prompt("Realizo mantenimiento:", mantenimiento6[a].realizo_mantenimiento);
            let nuevoreviso = prompt("Reviso mantenimiento:", mantenimiento6[a].reviso_Mantenimiento);
            let nuevonovedad = prompt("Nueva novedad:", mantenimiento6[a].novedad);
            if(nuevotipo !== null){
                mantenimiento6[a].tipo_mantenimiento = nuevotipo;
                mantenimiento6[a].fecha = nuevafecha;
                mantenimiento6[a].observacion = nuevoobservacion;
                mantenimiento6[a].equipo_apto = nuevoeq;
                mantenimiento6[a].realizo_mantenimiento=nuevorealizo
                mantenimiento6[a].reviso_Mantenimiento=nuevoreviso
                mantenimiento6[a].novedad=nuevonovedad
            }
            guardar7();
            cargetable6();
        });
        celdaAccion.appendChild(botonModificar);
        let botonEliminar = document.createElement("button");
        botonEliminar.innerText = "🗑️";
        botonEliminar.style.backgroundColor = "white";
        botonEliminar.addEventListener("click", function(){
            mantenimiento6.splice(a, 1);
            guardar7();
            cargetable6();
        });
        celdaAccion.appendChild(botonEliminar);
    }
    else{
        accion.style.display="none"
    }
    }
}
cargetable6()
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

