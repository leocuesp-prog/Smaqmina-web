
let mantenimiento2=JSON.parse(localStorage.getItem("mantenimiento2"))||[]
let tabla2=document.getElementById("tableman2") 
const usuarioActivo = localStorage.getItem("usuarioActivo");
let accion=document.getElementById("accion")     
function guardar3(){
    localStorage.setItem("mantenimiento2",JSON.stringify(mantenimiento2))
}
function cargetable2(){
    tabla2.innerHTML = "";
    for( let a=0; a<mantenimiento2.length;a++){
        let fila=tabla2.insertRow()
        fila.insertCell(0).innerText = a + 1;
        let tipo_manCell = fila.insertCell(1);
        tipo_manCell.innerText = mantenimiento2[a].tipo_mantenimiento;
        let fechaCell = fila.insertCell(2);
        fechaCell.innerText = mantenimiento2[a].fecha;
        let observacionCell = fila.insertCell(3);
        observacionCell.innerText = mantenimiento2[a].observacion;
        let eq_apCell = fila.insertCell(4);
        eq_apCell.innerText = mantenimiento2[a].equipo_apto;
        let realizoCell = fila.insertCell(5);
        realizoCell.innerText = mantenimiento2[a].realizo_mantenimiento;
        let revisoCell = fila.insertCell(6);
        revisoCell.innerText = mantenimiento2[a].reviso_Mantenimiento;
        let novedadCell = fila.insertCell(7);
        novedadCell.innerText = mantenimiento2[a].novedad;
        if(usuarioActivo){
        let celdaAccion = fila.insertCell(8);
        let botonModificar = document.createElement("button");
        botonModificar.innerText = "✏️";
        botonModificar.style.backgroundColor="white";
        botonModificar.addEventListener("click", function(){
            let nuevotipo = prompt("Nuevo tipo mantenimiento:", mantenimiento2[a].tipo_mantenimiento);
            let nuevafecha = prompt("Nueva fecha:", mantenimiento2[a].fecha);
            let nuevoobservacion = prompt("Nueva observacion:", mantenimiento2[a].observacion);
            let nuevoeq = prompt("equipo apto:", mantenimiento2[a].equipo_apto);
            let nuevorealizo = prompt("Realizo mantenimiento:", mantenimiento2[a].realizo_mantenimiento);
            let nuevoreviso = prompt("Reviso mantenimiento:", mantenimiento2[a].reviso_Mantenimiento);
            let nuevonovedad = prompt("Nueva novedad:", mantenimiento2[a].novedad);
            if(nuevotipo !== null){
                mantenimiento2[a].tipo_mantenimiento = nuevotipo;
                mantenimiento2[a].fecha = nuevafecha;
                mantenimiento2[a].observacion = nuevoobservacion;
                mantenimiento2[a].equipo_apto = nuevoeq;
                mantenimiento2[a].realizo_mantenimiento=nuevorealizo
                mantenimiento2[a].reviso_Mantenimiento=nuevoreviso
                mantenimiento2[a].novedad=nuevonovedad
            }
            guardar3();
            cargetable2();
        });
        celdaAccion.appendChild(botonModificar);
        let botonEliminar = document.createElement("button");
        botonEliminar.innerText = "🗑️";
        botonEliminar.style.backgroundColor = "white";
        botonEliminar.addEventListener("click", function(){
            mantenimiento2.splice(a, 1);
            guardar3();
            cargetable2();
        });
        celdaAccion.appendChild(botonEliminar);
        }
        else{
            accion.style.display="none"
        }
    }
}
cargetable2()
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

