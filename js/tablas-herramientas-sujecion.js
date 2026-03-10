let herramientas4 = JSON.parse(localStorage.getItem("herramientas4")) || [];
let tabla = document.getElementById("tabladatos");
const usuarioActivo = localStorage.getItem("usuarioActivo");
let accion=document.getElementById("accion")
function guardar(){
    localStorage.setItem("herramientas4", JSON.stringify(herramientas4));
}
function cargarTabla(){

    tabla.innerHTML = "";

    for(let i = 0; i < herramientas4.length; i++){

        let fila = tabla.insertRow();

        fila.insertCell(0).innerText = i + 1;

        let nombreCell = fila.insertCell(1);
        nombreCell.innerText = herramientas4[i].nombre;

        let cantidadCell = fila.insertCell(2);
        cantidadCell.innerText = herramientas4[i].bueno;

        let celdaEstado = fila.insertCell(3);

        let select = document.createElement("select");
        let estados = ["Bueno", "Regular", "Malo"];

        estados.forEach(function(estado){// la variable estados se va ahora almacenar en la funcion donde dice estado y se puede verificar la opcion que en el formato se selcciono
            let option = document.createElement("option");
            option.text = estado;
            select.add(option);
        });

        select.addEventListener("change", function(){

            if(select.value === "Bueno"){
                cantidadCell.innerText = herramientas4[i].bueno;
            }
            if(select.value === "Regular"){
                cantidadCell.innerText = herramientas4[i].regular;
            }
            if(select.value === "Malo"){
                cantidadCell.innerText = herramientas4[i].malo;
            }
        });
        celdaEstado.appendChild(select);
        if(usuarioActivo){
        let celdaAccion = fila.insertCell(4);
        let botonModificar = document.createElement("button");
        botonModificar.innerText = "✏️";
        botonModificar.style.backgroundColor="white";
        botonModificar.addEventListener("click", function(){
            let nuevoNombre = prompt("Nuevo nombre:", herramientas4[i].nombre);
            let nuevoBueno = prompt("Cantidad Bueno:", herramientas4[i].bueno);
            let nuevoRegular = prompt("Cantidad Regular:", herramientas4[i].regular);
            let nuevoMalo = prompt("Cantidad Malo:", herramientas4[i].malo);
            if(nuevoNombre !== null){
                herramientas4[i].nombre = nuevoNombre;
                herramientas4[i].bueno = parseInt(nuevoBueno) || 0;
                herramientas4[i].regular = parseInt(nuevoRegular) || 0;
                herramientas4[i].malo = parseInt(nuevoMalo) || 0;
            }
            guardar();
            cargarTabla();
        });
        celdaAccion.appendChild(botonModificar); 
        let botonEliminar = document.createElement("button");
        botonEliminar.innerText = "🗑️";
        botonEliminar.style.backgroundColor = "white";
        botonEliminar.addEventListener("click", function(){
            herramientas4.splice(i, 1);
            guardar();
            cargarTabla();
        });
        celdaAccion.appendChild(botonEliminar);
    }
    else{
        accion.style.display="none"
    }
    }
}
cargarTabla();
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

